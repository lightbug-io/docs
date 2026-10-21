import { normalizeV1Responses } from './responses'
import spec from '../public/swagger/v1.json'

describe('V1 response normalization', () => {
    test.each(['200', '201', '202', '204', '400', '401', '404', '500', 'default', '2XX'])(
        'preserves response %s, including metadata and bodyless responses', (status) => {
            const response = { description: 'Result', headers: { Location: { schema: { type: 'string' } } } }
            const responses = { [status]: response }
            normalizeV1Responses(responses)
            expect(responses).toEqual({ [status]: response })
            expect(responses[status]).not.toHaveProperty('content')
        }
    )

    test('retains all statuses in the same operation', () => {
        const responses = { '200': { description: 'OK' }, '204': { description: 'No content' }, '404': { description: 'Missing' } }
        normalizeV1Responses(responses)
        expect(Object.keys(responses)).toEqual(['200', '204', '404'])
    })

    test.each(['text/plain', 'text/csv', 'application/pdf', 'application/octet-stream', 'application/problem+json'])(
        'preserves a non-JSON-only %s response', (type) => {
            const responses = { '200': { content: { [type]: { schema: { type: 'string' } } } } }
            const original = JSON.parse(JSON.stringify(responses))
            normalizeV1Responses(responses)
            expect(responses).toEqual(original)
        }
    )

    test('preserves multiple non-JSON formats and their examples', () => {
        const responses = { '201': { content: { 'text/plain': { example: 'created' }, 'text/csv': { example: 'id\n1' } } } }
        const original = JSON.parse(JSON.stringify(responses))
        normalizeV1Responses(responses)
        expect(responses).toEqual(original)
    })

    test.each(['200', '201', '400', 'default'])(
        'retains the established JSON-only cleanup for %s', (status) => {
            const json = { schema: { type: 'object' }, example: { id: 1 } }
            const responses = { [status]: { description: 'Result', content: { 'application/json': json, 'text/xml': { schema: { type: 'string' } } } } }
            normalizeV1Responses(responses)
            expect(responses[status]).toEqual({ description: 'Result', content: { 'application/json': json } })
        }
    )

    test('example overrides preserve existing schema and encoding', () => {
        const schema = { type: 'object', properties: { id: { type: 'integer' } } }
        const responses = { '200': { content: { 'application/json': { schema, encoding: {}, example: { id: 0 } } } } }
        normalizeV1Responses(responses, { '200': { 'application/json': { example: { id: 1 } } } })
        expect(responses['200'].content['application/json']).toEqual({ schema, encoding: {}, example: { id: 1 } })
    })

    test('schema overrides replace rather than deep-merge the old schema', () => {
        const responses = { '200': { content: { 'application/json': { schema: { type: 'object', properties: { old: {} } } } } } }
        normalizeV1Responses(responses, { '200': { 'application/json': { schema: { type: 'array', items: { type: 'string' } } } } })
        expect(responses['200'].content['application/json'].schema).toEqual({ type: 'array', items: { type: 'string' } })
    })

    test('overrides preserve unrelated non-JSON media types, statuses and metadata', () => {
        const responses = {
            '200': { description: 'Report', headers: { ETag: {} }, links: { next: {} }, content: { 'text/csv': { schema: { type: 'string' } }, 'text/plain': { example: 'report' } } },
            '204': { description: 'Empty' },
        }
        normalizeV1Responses(responses, { '200': { 'text/csv': { example: 'id\n1' } } })
        expect(responses['200']).toEqual({ description: 'Report', headers: { ETag: {} }, links: { next: {} }, content: { 'text/csv': { schema: { type: 'string' }, example: 'id\n1' }, 'text/plain': { example: 'report' } } })
        expect(responses['204']).toEqual({ description: 'Empty' })
    })

    test('does not invent statuses from overrides', () => {
        const responses = { '204': { description: 'Empty' } }
        normalizeV1Responses(responses, { '200': { 'application/json': { example: {} } } })
        expect(Object.keys(responses)).toEqual(['204'])
    })

    test('preserves response references', () => {
        const responses = { default: { $ref: '#/components/responses/Error' } }
        normalizeV1Responses(responses)
        expect(responses).toEqual({ default: { $ref: '#/components/responses/Error' } })
    })

    test('handles absent responses', () => {
        expect(() => normalizeV1Responses(undefined)).not.toThrow()
    })

    test('is idempotent for repeated loader use', () => {
        const responses = { '200': { content: { 'application/json': { schema: { type: 'string' } }, 'text/xml': {} } }, '204': { description: 'Empty' } }
        const overrides = { '200': { 'application/json': { example: 'ok' } } }
        normalizeV1Responses(responses, overrides)
        const once = JSON.parse(JSON.stringify(responses))
        normalizeV1Responses(responses, overrides)
        expect(responses).toEqual(once)
    })

    test.each([
        '/devices/{id}/points/{fk}',
        '/devices/{id}/readings/{fk}',
        '/devices/{id}/notificationTriggers/{fk}',
        '/users/{id}/geofences/{fk}',
    ] as const)('preserves the source 204 response for supported DELETE %s', (path) => {
        const responses = JSON.parse(JSON.stringify(spec.paths[path].delete.responses))
        normalizeV1Responses(responses)
        expect(responses).toEqual({ '204': { description: 'Request was successful' } })
    })
})
