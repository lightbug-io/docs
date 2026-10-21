type MediaType = Record<string, unknown>
type Content = Record<string, MediaType>
type Response = {
    content?: Content
    [key: string]: unknown
}

/** Apply documentation overrides without discarding response statuses or metadata. */
export function normalizeV1Responses(
    responses: Record<string, Response> | undefined,
    overrides: Record<string, Content> = {}
): void {
    for (const [status, response] of Object.entries(responses ?? {})) {
        if (overrides[status]) {
            const content = { ...response.content }
            for (const [type, override] of Object.entries(overrides[status])) {
                // A supplied schema replaces the old schema, but an example-only
                // override must not erase the existing schema or other media types.
                content[type] = { ...content[type], ...override }
            }
            response.content = content
        }

        // Keep the existing JSON-only presentation for LoopBack responses that
        // advertise JSON plus XML/JavaScript aliases. Non-JSON-only responses,
        // references and bodyless responses (notably 204) must survive unchanged.
        if (response.content?.['application/json']) {
            response.content = { 'application/json': response.content['application/json'] }
        }
    }
}
