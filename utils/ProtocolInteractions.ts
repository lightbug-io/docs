import {
    getMessageDocumentation,
    type DocumentationOperation,
    type DocumentationVariant,
    type MessageDocumentation,
} from './MessageDocumentation'

interface InteractionReference {
    messageId: number
    method?: string
    context?: string
    target?: string
    versions: Record<string, { messageVersion?: number; target?: string }>
}

export type ResolvedProtocolInteraction = DocumentationVariant & {
    interactionId: string
    interactionVersion: number
    messageId: number
    operationId: string
    method?: string
}

const object = (value: any): value is Record<string, any> => !!value && typeof value === 'object' && !Array.isArray(value)
const selector = (reference: InteractionReference) => reference.method?.toLowerCase() ?? reference.context!
const sourceFor = (protocol: any, reference: InteractionReference) => {
    const message = protocol.messages?.[reference.messageId]
    return reference.method === undefined ? message?.contexts?.[reference.context!] : message?.methods?.[reference.method]
}

/** Interactions reference existing documentation; they never redefine wire messages or exchanges. */
export function validateProtocolInteractions(protocol: any): string[] {
    if (protocol.interactions === undefined) return []
    if (!object(protocol.interactions)) return ['Protocol interactions must be a mapping']
    const errors: string[] = []
    const keys = (value: Record<string, any>, allowed: string[], label: string) => {
        for (const key of Object.keys(value)) if (!allowed.includes(key)) errors.push(`${label}: unknown property ${key}`)
    }
    const target = (value: any, label: string) => {
        if (value !== undefined && (typeof value !== 'string' || !value.trim())) errors.push(`${label}: target must be a nonempty string`)
    }
    for (const [id, value] of Object.entries(protocol.interactions)) {
        const label = `Interaction ${id}`
        if (!/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(id)) errors.push(`${label}: needs a stable lowercase id`)
        if (!object(value)) { errors.push(`${label}: must be an object`); continue }
        keys(value, ['messageId', 'method', 'context', 'versions', 'target'], label)
        target(value.target, label)
        const reference = value as unknown as InteractionReference
        if (!Number.isSafeInteger(reference.messageId) || reference.messageId < 0 || !protocol.messages?.[reference.messageId]) errors.push(`${label}: references unknown message ${reference.messageId}`)
        if ((reference.method === undefined) === (reference.context === undefined)) errors.push(`${label}: needs exactly one method or context`)
        if (reference.method !== undefined && (typeof reference.method !== 'string' || !Object.prototype.hasOwnProperty.call(protocol.messages?.[reference.messageId]?.methods || {}, reference.method))) errors.push(`${label}: references unknown method ${reference.method}`)
        if (reference.context !== undefined && (typeof reference.context !== 'string' || !Object.prototype.hasOwnProperty.call(protocol.messages?.[reference.messageId]?.contexts || {}, reference.context))) errors.push(`${label}: references unknown context ${reference.context}`)
        const source = sourceFor(protocol, reference)
        if (!object(source) || (!source.exchange && !source.versions)) errors.push(`${label}: source needs an exchange or versions`)
        if (!object(reference.versions) || !Object.keys(reference.versions).length) { errors.push(`${label}: versions must be a nonempty mapping`); continue }
        for (const [revision, selection] of Object.entries(reference.versions)) {
            const versionLabel = `${label}/${revision}`
            if (!/^[1-9]\d*$/.test(revision) || !Number.isSafeInteger(Number(revision))) errors.push(`${versionLabel}: revision must be a positive safe integer`)
            if (!object(selection)) { errors.push(`${versionLabel}: must be an object`); continue }
            keys(selection, ['messageVersion', 'target'], versionLabel)
            target(selection.target, versionLabel)
            if (source?.versions !== undefined) {
                if (typeof selection.messageVersion !== 'number' || !Number.isInteger(selection.messageVersion)) errors.push(`${versionLabel}: needs an explicit messageVersion`)
                else if (!Object.prototype.hasOwnProperty.call(source.versions, selection.messageVersion)) errors.push(`${versionLabel}: references unknown source messageVersion ${selection.messageVersion}`)
                else if (!Object.prototype.hasOwnProperty.call(protocol.messages?.[reference.messageId]?.versions || {}, selection.messageVersion)) errors.push(`${versionLabel}: references unknown messageVersion ${selection.messageVersion}`)
            } else if (selection.messageVersion !== undefined) errors.push(`${versionLabel}: unversioned source cannot select messageVersion`)
            const exchange = { ...source?.exchange, ...source?.versions?.[selection.messageVersion!] }
            if (!['request', 'response', 'publication'].some(role => object(exchange[role]))) errors.push(`${versionLabel}: source needs at least one request, response or publication message`)
        }
    }
    return errors
}

function checkedInteractions(protocol: any): Record<string, InteractionReference> {
    const errors = validateProtocolInteractions(protocol)
    if (errors.length) throw new Error(errors.join('\n'))
    return protocol.interactions || {}
}

function resolveReference(protocol: any, id: string, revision: number, reference: InteractionReference): ResolvedProtocolInteraction {
    const selection = reference.versions[revision]
    if (!selection) throw new Error(`Interaction ${id}: unknown revision ${revision}`)
    const docs = getMessageDocumentation(protocol.messages[reference.messageId])!
    const operation = docs.operations.find(item => item.id === selector(reference) && item.method === reference.method)
    if (!operation) throw new Error(`Interaction ${id}: source has no normalized operation`)
    const variant = selection.messageVersion === undefined ? operation
        : operation.variants?.find(item => item.messageVersion === selection.messageVersion) ?? (operation.messageVersion === selection.messageVersion ? operation : undefined)
    if (!variant) throw new Error(`Interaction ${id}: source has no normalized messageVersion ${selection.messageVersion}`)
    const { variants, ...view } = { ...operation, ...variant } as DocumentationOperation
    return {
        ...view,
        target: selection.target ?? reference.target ?? view.target ?? docs.target,
        interactionId: id,
        interactionVersion: revision,
        messageId: reference.messageId,
        operationId: operation.id,
    }
}

/** Resolve one authored revision without treating it as a wire version or choosing an implicit default. */
export function resolveProtocolInteraction(protocol: any, id: string, revision: number): ResolvedProtocolInteraction {
    const interactions = checkedInteractions(protocol)
    const reference = Object.prototype.hasOwnProperty.call(interactions, id) ? interactions[id] : undefined
    if (!reference) throw new Error(`Unknown interaction ${id}`)
    if (!Number.isSafeInteger(revision) || revision < 1) throw new Error(`Interaction ${id}: revision must be a positive safe integer`)
    return resolveReference(protocol, id, revision, reference)
}

/** Keep existing normalized operation identities and anchors for renderers, helpers and links. */
export function getInteractionDocumentation(protocol: any, messageId: number): (MessageDocumentation & { interactions?: ResolvedProtocolInteraction[] }) | undefined {
    const interactions = checkedInteractions(protocol)
    const docs = getMessageDocumentation(protocol.messages?.[messageId])
    if (!docs) return undefined
    const references = Object.entries(interactions).filter(([, reference]) => reference.messageId === messageId)
    if (!references.length) return docs
    return {
        ...docs,
        interactions: references.flatMap(([id, reference]) => Object.keys(reference.versions).map(Number).sort((a, b) => b - a)
            .map(revision => resolveReference(protocol, id, revision, reference))),
    }
}
