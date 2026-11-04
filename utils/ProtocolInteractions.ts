import {
    getMessageDocumentation,
    getOperationVariant,
    validateMessageDocumentation,
    type DocumentationOperation,
    type DocumentationVariant,
} from './MessageDocumentation'

export type ResolvedProtocolInteraction = DocumentationVariant & {
    interactionId: string
    interactionVersion: number
    messageId: number
    operationId: string
    method?: string
}

/** Validate the same inline definitions used by the documentation renderer. */
export function validateProtocolInteractions(protocol: any): string[] {
    const errors = protocol.interactions === undefined ? [] : ['Interactions belong inside their message definitions']
    return errors.concat(Object.keys(protocol.messages || {}).flatMap(id => validateMessageDocumentation(protocol, Number(id))))
}

/** Select an interaction revision explicitly; it never supplies or infers a wire selector. */
export function resolveProtocolInteraction(protocol: any, messageId: number, id: string, revision: number): ResolvedProtocolInteraction {
    const message = protocol.messages?.[messageId]
    if (!message) throw new Error(`Unknown message ${messageId}`)
    const errors = validateMessageDocumentation(protocol, messageId)
    if (errors.length) throw new Error(errors.join('\n'))
    const authored = Object.prototype.hasOwnProperty.call(message.interactions || {}, id) ? message.interactions[id] : undefined
    if (!authored) throw new Error(`Message ${messageId}: unknown interaction ${id}`)
    if (!Number.isSafeInteger(revision) || revision < 1 || !Object.prototype.hasOwnProperty.call(authored.versions, revision)) {
        throw new Error(`Interaction ${id}: unknown revision ${revision}`)
    }
    const docs = getMessageDocumentation(message)!
    const operation = docs.operations.find(item => item.id === id)!
    const { variants, ...view } = getOperationVariant(operation, String(revision)) as DocumentationOperation
    return {
        ...view,
        interactionId: id,
        interactionVersion: revision,
        messageId,
        operationId: operation.id,
        target: view.target ?? docs.target,
    }
}
