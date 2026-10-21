/** Optional presentation metadata. Wire definitions remain in header and message.data. */
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

export interface DocumentationExample {
    title: string
    provenance: 'generated' | 'captured'
    description?: string
    target?: string
    frames: { role: 'request' | 'response' | 'publication' | 'upload'; label: string; bytes: string }[]
}

export interface DocumentationVariant {
    id: string
    title: string
    messageVersion?: number
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

export interface MessageDocumentation {
    summary: string
    target?: string
    operations: DocumentationOperation[]
    notes?: { id: string; title: string; description: string }[]
}

export function getMessageDocumentation(message: any): MessageDocumentation | undefined {
    return message?.docs && Array.isArray(message.docs.operations) && message.docs.operations.length
        ? message.docs
        : undefined
}

/** A variant overrides only the operation properties it explicitly supplies. */
export function getOperationVariant(operation: DocumentationOperation, variantId?: string): DocumentationVariant {
    const variant = operation.variants?.find(item => item.id === variantId) || operation.variants?.[0]
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
            values: Object.entries(context.values || {}).map(([value, description]) => ({
                value: Number(value),
                name: definition.values?.[value]?.name,
                description,
            })),
            maxBytes: context.maxBytes,
        }
    }).filter((field): field is NonNullable<typeof field> => field !== undefined)
}

/** Check references before a site build can publish misleading contextual documentation. */
export function validateMessageDocumentation(protocol: any, messageId: number): string[] {
    const message = protocol.messages?.[messageId]
    if (!message?.docs) return []
    const docs = message.docs as MessageDocumentation
    const errors: string[] = []
    const prefix = `Message ${messageId} documentation`
    const fail = (text: string) => errors.push(`${prefix}: ${text}`)
    const identifier = /^[a-z][a-z0-9-]*$/
    const validateIds = (items: any[], label: string) => {
        const ids = new Set<string>()
        for (const item of items) {
            if (!item || !identifier.test(item.id)) fail(`${label} needs a stable lowercase id`)
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
    if (docs.notes) validateIds(docs.notes, 'note')

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

    for (const operation of docs.operations) {
        if (!operation || typeof operation !== 'object') continue
        if (!operation.title?.trim()) fail(`${operation.id} needs a title`)
        if (operation.method && !Object.prototype.hasOwnProperty.call(message.methods || {}, operation.method)) {
            fail(`${operation.id} references unsupported method ${operation.method}`)
        }
        if (operation.variants) validateIds(operation.variants, `${operation.id} variant`)
        for (const variant of operation.variants?.length ? operation.variants : [operation]) {
            const view = operation.variants?.length ? getOperationVariant(operation, variant.id) : operation
            const label = `${operation.id}/${variant.id}`
            if (view.messageVersion !== undefined && (!Number.isInteger(view.messageVersion) || view.messageVersion < 0)) {
                fail(`${label} has invalid messageVersion`)
            }
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
