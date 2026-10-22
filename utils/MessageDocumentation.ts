import { calculateCRC16XMODEM, getElementByteSize, parseRawMessage, readTypedData } from '../src/protocol/base.gen'
import { parseByteString } from './ByteStringParser'

/** Structured message documentation. Wire definitions remain in header and message.data. */
export interface DocumentationField {
    description?: string
    presence?: 'required' | 'optional' | 'ignored' | 'omitted'
    value?: number
    values?: Record<string, string>
    maxBytes?: number
}

export interface DocumentationContext {
    title?: string
    description?: string
    /** Response payloads may belong to another message, for example ACK (5). */
    messageId?: number
    headers?: Record<string, DocumentationField>
    fields?: Record<string, DocumentationField>
}

/** Keep standard reply-envelope rules linked; explicit exceptions stay local. */
export function commonResponseHeaderIds(context: DocumentationContext): string[] {
    return Object.entries(context.headers || {}).filter(([id, field]) => {
        if (field.description || field.values || field.maxBytes !== undefined ||
            !['required', 'optional'].includes(field.presence || '')) return false
        return id === '3' && field.value === undefined || id === '4' && field.value === 0
    }).map(([id]) => id)
}

export interface DocumentationExample {
    title: string
    provenance: 'generated' | 'captured'
    description?: string
    target?: string
    frames: { role: 'request' | 'response' | 'publication' | 'upload'; label: string; bytes: string }[]
}

/** Align each exchange stage without changing frame order or published anchors. */
export function documentationExamplesForContext(examples: DocumentationExample[], role: 'request' | 'response' | 'publication') {
    return examples.map((example, exampleIndex) => {
        const frames = example.frames.map((frame, frameIndex) => ({ ...frame, frameIndex }))
            .filter(frame => (frame.role === 'upload' ? 'publication' : frame.role) === role)
        return { ...example, exampleIndex, showNumber: examples.length > 1, frames, startsExchange: frames[0]?.frameIndex === 0 }
    }).filter(example => example.frames.length)
}

/** Project observed payload values, never defaults, from intact matching captures. */
export function capturedDocumentationValues(example: DocumentationExample, messageId: number, definitions: Record<string, any>, messageVersion?: number) {
    if (example.provenance !== 'captured') return []
    return example.frames.flatMap(frame => {
        try {
            const { bytes } = parseByteString(frame.bytes)
            const start = bytes[0] === 0x4c && bytes[1] === 0x42 ? 2 : 0
            const parsed = parseRawMessage(bytes)
            if (parsed.protocolVersion !== 3 || parsed.messageType !== messageId || parsed.encrypted || parsed.length !== bytes.length - start) return []
            if (calculateCRC16XMODEM(bytes.slice(start, -2)) !== (bytes[bytes.length - 2] | bytes[bytes.length - 1] << 8)) return []
            // Account for every field and length prefix; the decoder alone is permissive.
            const consumed = 11 + [parsed.header, parsed.data].reduce((total, fields) => total + Object.entries(fields)
                .reduce((size, [id, data]) => size + 1 + (Number(id) < 128 ? 1 : 2) + (data?.length || 0), 0), 0)
            if (consumed !== parsed.length) return []
            // Do not infer a universal legacy version from an omitted selector.
            if (messageVersion !== undefined && readTypedData(parsed.header[22] || [], 'uint8') !== messageVersion) return []
            return Object.entries(parsed.data).flatMap(([id, bytes]) => {
                const field = definitions[id]
                if (!field || !bytes || typeof field.type !== 'string') return []
                if (messageVersion !== undefined && field.versions && !field.versions.includes(messageVersion)) return []
                if (!bytes.length) return [{ id: Number(id), value: 'Empty (0 bytes)' }]
                const size = getElementByteSize(field.type)
                if (size !== null && (/^u?int(8|16|32|64)$/.test(field.type) ? bytes.length > size : bytes.length !== size)) return []
                const value = readTypedData(bytes, field.type)
                const raw = field.conversion !== undefined
                const declaredUnit = raw ? field['raw-unit'] : field.unit
                const unit = typeof declaredUnit === 'string' ? declaredUnit : ''
                const label = field.values?.[String(value)]?.name
                return [{ id: Number(id), value: `${Array.isArray(value) ? JSON.stringify(value) : String(value)}${unit === '%' ? '%' : unit ? ` ${unit}` : ''}${label ? ` · ${label}` : ''}${raw ? ' (raw)' : ''}` }]
            })
        } catch { return [] }
    })
}

/** Link only explicit HTTP(S) URLs; surrounding prose remains escaped Vue text. */
export function documentationTextParts(text: string) {
    const parts: { text: string; href?: string }[] = []
    let end = 0
    for (const match of text.matchAll(/https?:\/\/[^\s<>"']+/gi)) {
        let link = match[0].replace(/[.,;:!?]+$/, '')
        while (link.endsWith(')') && (link.match(/\)/g)?.length || 0) > (link.match(/\(/g)?.length || 0)) link = link.slice(0, -1)
        try {
            const url = new URL(link)
            if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) continue
            parts.push({ text: text.slice(end, match.index) }, { text: link, href: url.href })
            end = match.index! + link.length
        } catch { /* Invalid URLs remain plain text. */ }
    }
    parts.push({ text: text.slice(end) })
    return parts
}

export interface DocumentationVariant {
    id: string
    title: string
    messageVersion?: number
    /** Canonical message-version key, normalized to a string for object references. */
    format?: string
    /** Retain existing fragment links independently of the authoring shape. */
    anchorId?: string
    /** Retain older wire formats in a collapsed compatibility reference. */
    legacy?: boolean
    description?: string
    target?: string
    request?: DocumentationContext
    response?: DocumentationContext
    publication?: DocumentationContext
    errors?: { code: number; description: string }[]
    examples?: DocumentationExample[]
}

export interface DocumentationOperation extends DocumentationVariant {
    method?: string
    variants?: DocumentationVariant[]
}

/** Human-facing release labels do not replace the numeric wire version. */
export interface DocumentationFormat {
    id: string
    label: string
    messageVersion?: number
    legacy?: boolean
    description?: string
    fields?: Record<string, DocumentationField>
    /** Compatibility anchor only, never an additional authored format identifier. */
    anchorId?: string
}

export interface MessageDocumentation {
    summary: string
    target?: string
    /** Message-specific field summaries, referencing message.data definitions. */
    fields?: Record<string, DocumentationField>
    formats?: DocumentationFormat[]
    operations: DocumentationOperation[]
    notes?: { id: string; title: string; description: string; placement?: 'overview' | 'reference' }[]
}

export function getDocumentationFormat(docs: MessageDocumentation, view: DocumentationVariant): DocumentationFormat | undefined {
    return docs.formats?.find(format => format.id === view.format)
}

/** Only show a target again when a more specific context actually overrides it. */
export function documentationTargetOverride(target?: string, inherited?: string): string | undefined {
    const normalize = (value?: string) => value?.trim().replace(/\s+/g, ' ').toLowerCase()
    return normalize(target) && normalize(target) !== normalize(inherited) ? target : undefined
}

/** Unmigrated messages keep their existing prose-and-field renderer. */
export function hasInlineMessageDocumentation(message: any): boolean {
    return !!message && (message.versions !== undefined || message.contexts !== undefined ||
        Object.values(message.methods || {}).some((method: any) => method?.exchange !== undefined || method?.versions !== undefined))
}

function wireVersion(exchange: any): number | undefined {
    for (const role of ['request', 'response', 'publication']) {
        const header = exchange?.[role]?.headers?.[22]
        if (Number.isInteger(header?.value)) return header.value
        // Legacy selectors can allow zero/omission alongside one explicit version.
        const explicit = Object.keys(header?.values || {}).map(Number).filter(value => value > 0)
        if (explicit.length === 1) return explicit[0]
    }
    return undefined
}

export function getMessageDocumentation(message: any): MessageDocumentation | undefined {
    if (!hasInlineMessageDocumentation(message)) return undefined
    const versions = message.versions || {}
    const operations: DocumentationOperation[] = []
    const addOperation = (id: string, source: any, method?: string) => {
        if (!source || (!source.exchange && !source.versions)) return
        const contextualDescriptions = (exchange: any) => Object.fromEntries(Object.entries(exchange || {}).map(([key, value]: [string, any]) => {
            if (!['request', 'response'].includes(key) || !value?.fields || value.messageId !== undefined) return [key, value]
            return [key, { ...value, fields: Object.fromEntries(Object.entries(value.fields).map(([id, usage]: [string, any]) => [
                id, { description: source[key]?.[id]?.description, ...usage },
            ])) }]
        }))
        const base: DocumentationOperation = {
            ...contextualDescriptions(source.exchange), id, method, title: source.title || method || id,
            description: source.description, target: source.target,
        }
        const variants = Object.entries(source.versions || {}).sort(([a], [b]) => Number(b) - Number(a)).map(([version, exchange]: [string, any]) => {
            const messageVersion = Number(version)
            const anchorId = `v${version}`
            return {
                ...contextualDescriptions(exchange), id: version, anchorId,
                title: exchange?.title || versions[version]?.label || version, format: version, messageVersion, legacy: !!versions[version]?.legacy,
            }
        })
        if (variants.length === 1) operations.push({ ...base, ...variants[0], id, title: base.title })
        else operations.push(variants.length ? { ...base, variants } : base)
    }
    for (const [method, value] of Object.entries(message.methods || {})) addOperation(method.toLowerCase(), value, method)
    for (const [id, value] of Object.entries(message.contexts || {})) addOperation(id, value)

    const fieldsFor = (version?: string) => Object.fromEntries(Object.entries(message.data || {})
        .filter(([, field]: [string, any]) => version === undefined || !field.versions || Array.isArray(field.versions) && field.versions.includes(Number(version)))
        .map(([id]) => [id, {}]))
    let currentAnchorUsed = false
    let legacyAnchorUsed = false
    const formats: DocumentationFormat[] = Object.entries(versions).sort(([a], [b]) => Number(b) - Number(a)).map(([id, version]: [string, any]) => {
        const anchorId = version?.legacy
            ? (!legacyAnchorUsed ? 'legacy' : undefined)
            : (!currentAnchorUsed ? 'current' : undefined)
        if (version?.legacy) legacyAnchorUsed = true
        else currentAnchorUsed = true
        return {
            id, label: version?.label, description: version?.description, legacy: !!version?.legacy,
            messageVersion: Number(id), fields: fieldsFor(id), anchorId,
        }
    })
    return {
        summary: message.description || '', target: message.target, notes: message.notes,
        fields: formats.length ? undefined : fieldsFor(),
        formats: formats.length ? formats : undefined, operations,
    }
}

/** A variant overrides only the operation properties it explicitly supplies. */
export function getOperationVariant(operation: DocumentationOperation, variantId?: string): DocumentationVariant {
    const variant = operation.variants?.find(item => variantId !== undefined && (item.id === variantId || item.anchorId === variantId)) || operation.variants?.[0]
    return variant ? { ...operation, ...variant } : operation
}

export function resolveDocumentationFields(
    protocol: any,
    message: any,
    usage: Record<string, DocumentationField> | undefined,
    kind: 'headers' | 'fields',
) {
    const definitions = kind === 'headers' ? protocol.header : message.data
    return Object.entries(usage || {}).map(([key, context]) => {
        const definition = definitions?.[key]
        if (!definition) return undefined
        return {
            id: Number(key),
            name: definition.name,
            type: definition.type,
            baseDescription: definition.description || '',
            description: context.description ?? definition.description ?? '',
            presence: context.presence,
            value: context.value,
            valueName: context.value === undefined ? undefined : definition.values?.[context.value]?.name,
            values: Object.entries(context.values ?? (context.value === undefined ? definition.values || {} : {})).map(([value, details]: [string, any]) => ({
                value: Number(value),
                name: definition.values?.[value]?.name,
                description: typeof details === 'string' ? details : details.description || '',
            })),
            maxBytes: context.maxBytes,
        }
    }).filter((field): field is NonNullable<typeof field> => field !== undefined)
        // Required fields lead each group; stable sorting preserves all other
        // ordering and never mutates the wire definitions or documentation map.
        .sort((a, b) => Number(b.presence === 'required') - Number(a.presence === 'required'))
}

/** Validate the authoring shape before normalization can hide a typo or bad reference. */
function validateInlineDocumentation(message: any): string[] {
    const errors: string[] = []
    const object = (value: any) => !!value && typeof value === 'object' && !Array.isArray(value)
    const validateExchangeShape = (exchange: any, label: string) => {
        if (!object(exchange)) { errors.push(`${label} exchange must be an object`); return }
        for (const role of ['request', 'response', 'publication']) {
            const context = exchange[role]
            if (context === undefined) continue
            if (!object(context)) { errors.push(`${label} ${role} must be an object`); continue }
            for (const kind of ['headers', 'fields']) {
                if (context[kind] === undefined) continue
                if (!object(context[kind])) { errors.push(`${label} ${role} ${kind} must be a mapping`); continue }
                for (const [id, usage] of Object.entries(context[kind])) {
                    if (!object(usage)) errors.push(`${label} ${role} ${kind} ${id} must be an object`)
                }
            }
        }
        for (const kind of ['errors', 'examples']) {
            if (exchange[kind] !== undefined && (!Array.isArray(exchange[kind]) || exchange[kind].some((entry: any) => !object(entry)))) {
                errors.push(`${label} ${kind} must be a list of objects`)
            }
        }
    }
    if (message.contexts !== undefined && !object(message.contexts)) errors.push('contexts must be a mapping')
    for (const [id, context] of Object.entries(object(message.contexts) ? message.contexts : {})) {
        if (!object(context) || (!(context as any).exchange && !(context as any).versions)) errors.push(`${id} context needs an exchange or versions`)
    }
    if (message.notes !== undefined && (!Array.isArray(message.notes) || message.notes.some((note: any) => !object(note)))) errors.push('notes must be a list of objects')
    const versions = object(message.versions) ? message.versions : {}
    if (message.versions !== undefined && !object(message.versions)) errors.push('versions must be a numeric-keyed mapping')
    for (const [id, version] of Object.entries(versions) as [string, any][]) {
        if (!/^(0|[1-9]\d*)$/.test(id) || Number(id) > 255) errors.push(`invalid message version ${id}`)
        if (!object(version)) errors.push(`${id} version must be an object`)
        else {
            if (typeof version.label !== 'string' || !version.label.trim()) errors.push(`${id} version needs a label`)
            if (version.legacy !== undefined && typeof version.legacy !== 'boolean') errors.push(`${id} has invalid legacy flag`)
        }
    }
    for (const [id, field] of Object.entries(message.data || {}) as [string, any][]) {
        if (field.versions === undefined) continue
        if (!Array.isArray(field.versions) || !field.versions.length) errors.push(`field ${id} versions must be a nonempty list`)
        else for (const version of field.versions) {
            if (!Number.isInteger(version) || !Object.prototype.hasOwnProperty.call(versions, version)) errors.push(`field ${id} references unknown version ${version}`)
        }
    }
    for (const [name, source] of [...Object.entries(message.methods || {}), ...Object.entries(message.contexts || {})] as [string, any][]) {
        if (!source) continue
        if (source.exchange !== undefined) validateExchangeShape(source.exchange, name)
        if (source.versions === undefined) continue
        if (!object(source.versions)) { errors.push(`${name} versions must be a numeric-keyed mapping`); continue }
        for (const [version, exchange] of Object.entries(source.versions) as [string, any][]) {
            if (!Object.prototype.hasOwnProperty.call(versions, version)) errors.push(`${name} references unknown version ${version}`)
            if (!object(exchange)) { errors.push(`${name}/${version} exchange must be an object`); continue }
            validateExchangeShape(exchange, `${name}/${version}`)
            const merged = { ...source.exchange, ...exchange }
            for (const role of ['request', 'response', 'publication']) {
                const context = merged[role]
                const selector = wireVersion({ [role]: context })
                if (selector !== undefined && selector !== Number(version)) errors.push(`${name}/${version} ${role} header 22 disagrees with its message version`)
                // An ACK's fields belong to MT5, not to the originating message.
                if (context?.messageId !== undefined) continue
                for (const [id, usage] of Object.entries(context?.fields || {}) as [string, any][]) {
                    const applicable = message.data?.[id]?.versions
                    if (Array.isArray(applicable) && !applicable.includes(Number(version)) && !['omitted', 'ignored'].includes(usage?.presence)) {
                        errors.push(`${name}/${version} ${role} uses field ${id} outside its versions`)
                    }
                }
            }
        }
    }
    return errors
}

/** Check references before a site build can publish misleading contextual documentation. */
export function validateMessageDocumentation(protocol: any, messageId: number): string[] {
    const message = protocol.messages?.[messageId]
    if (!hasInlineMessageDocumentation(message)) return []
    const prefix = `Message ${messageId} documentation`
    const authoringErrors = validateInlineDocumentation(message)
    if (authoringErrors.length) return authoringErrors.map(error => `${prefix}: ${error}`)
    const docs = getMessageDocumentation(message)!
    const errors: string[] = []
    const fail = (text: string) => errors.push(`${prefix}: ${text}`)
    const identifier = /^[a-z][a-z0-9-]*$/
    const versionIdentifier = /^\d+$/
    const validateIds = (items: any[], label: string) => {
        const ids = new Set<string>()
        for (const item of items) {
            if (!item || !((label === 'format' || label.endsWith(' variant')) && versionIdentifier.test(item.id)) && !identifier.test(item.id)) fail(`${label} needs a stable lowercase id`)
            if (ids.has(item?.id)) fail(`duplicate ${label} id ${item.id}`)
            ids.add(item?.id)
        }
    }
    if (typeof docs.summary !== 'string' || !docs.summary.trim()) fail('summary is required')
    if (!Array.isArray(docs.operations) || !docs.operations.length) {
        fail('operations must be a nonempty list')
        return errors
    }
    validateIds(docs.operations, 'operation')
    if (docs.notes) {
        validateIds(docs.notes, 'note')
        for (const note of docs.notes) {
            if (!note || typeof note !== 'object') continue
            if (note.placement !== undefined && !['overview', 'reference'].includes(note.placement)) {
                fail(`${note.id} has invalid note placement`)
            }
        }
    }

    const validateContext = (context: DocumentationContext | undefined, label: string) => {
        if (!context) return
        const contextMessage = context.messageId === undefined ? message : protocol.messages?.[context.messageId]
        if (!contextMessage) fail(`${label} references unknown message ${context.messageId}`)
        for (const kind of ['headers', 'fields'] as const) {
            const definitions = kind === 'headers' ? protocol.header : contextMessage?.data
            for (const [key, field] of Object.entries(context[kind] || {})) {
                const definition = definitions?.[key]
                if (!/^\d+$/.test(key) || !definition) {
                    fail(`${label} references unknown ${kind} id ${key}`)
                    continue
                }
                if (!field || typeof field !== 'object') {
                    fail(`${label} ${kind} ${key} must be an object`)
                    continue
                }
                if (field.presence && !['required', 'optional', 'ignored', 'omitted'].includes(field.presence)) {
                    fail(`${label} ${kind} ${key} has invalid presence`)
                }
                if (field.maxBytes !== undefined && (!Number.isInteger(field.maxBytes) || field.maxBytes < 0)) {
                    fail(`${label} ${kind} ${key} has invalid maxBytes`)
                }
                for (const value of [field.value, ...Object.keys(field.values || {}).map(Number)]) {
                    if (value === undefined) continue
                    if (!Number.isInteger(value) || (definition.values && !Object.prototype.hasOwnProperty.call(definition.values, value))) {
                        fail(`${label} ${kind} ${key} references unknown value ${value}`)
                    }
                }
            }
        }
    }

    validateContext({ fields: docs.fields }, 'field summary')
    for (const format of docs.formats || []) validateContext({ fields: format.fields }, `${format.id} field summary`)

    for (const operation of docs.operations) {
        if (!operation || typeof operation !== 'object') continue
        if (!operation.title?.trim()) fail(`${operation.id} needs a title`)
        if (operation.method && !Object.values(protocol.header?.[5]?.values || {}).some((value: any) => value.name === operation.method)) {
            fail(`${operation.id} references unsupported method ${operation.method}`)
        }
        if (operation.variants) validateIds(operation.variants, `${operation.id} variant`)
        for (const variant of operation.variants?.length ? operation.variants : [operation]) {
            const view = operation.variants?.length ? getOperationVariant(operation, variant.id) : operation
            const label = `${operation.id}/${variant.id}`
            for (const role of ['request', 'response', 'publication'] as const) validateContext(view[role], `${label} ${role}`)
            for (const error of view.errors || []) {
                if (!protocol.header?.[4]?.values?.[error.code]) fail(`${label} references unknown status ${error.code}`)
            }
            for (const example of view.examples || []) {
                if (!example.title || !['generated', 'captured'].includes(example.provenance)) fail(`${label} example needs title and provenance`)
                if (!Array.isArray(example.frames) || !example.frames.length) {
                    fail(`${label} example needs frames`)
                    continue
                }
                for (const frame of example.frames) {
                    if (!['request', 'response', 'publication', 'upload'].includes(frame.role) || !frame.label || !frame.bytes) {
                        fail(`${label} example frame needs role, label and bytes`)
                    }
                }
            }
        }
    }
    return errors
}
