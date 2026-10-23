import { operationDefinition, operationDefinitionMarkdown } from './operation-definition'
import v1 from '../public/swagger/v1.json'
import v2 from '../public/swagger/v2.json'
// @ts-expect-error The existing js-yaml dependency does not ship declarations.
import yaml from 'js-yaml'

const fixture = () => ({
    openapi: '3.0.3', info: { title: 'Test', version: '1' },
    security: [{ Global: [] }], servers: [{ url: 'https://example.test' }],
    paths: { '/things': {
        parameters: [{ $ref: '#/components/parameters/Limit' }],
        servers: [{ url: 'https://path.example.test' }],
        get: { security: [{ Local: [] }], responses: {
            '200': { $ref: '#/components/responses/Result' },
            '400': { description: 'Nondefault response', headers: { Test: { schema: { type: 'string' } } } },
        } },
        post: { summary: 'Do not include another operation' },
    } },
    components: {
        parameters: { Limit: { name: 'limit', in: 'query', schema: { type: 'integer' } } },
        securitySchemes: { Global: { type: 'http', scheme: 'bearer' }, Local: { type: 'apiKey', in: 'header', name: 'Key' } },
        responses: { Result: { description: 'Result', content: {
            'application/json': { schema: { $ref: '#/components/schemas/Node' }, examples: { first: { value: 'one' }, second: { value: 'two' } } },
            'text/plain': { example: 'Alternative media' },
        } } },
        schemas: { Node: { type: 'object', properties: { next: { $ref: '#/components/schemas/Node' }, value: { enum: ['a', 'b'], description: 'Nested description' } } }, Unused: { type: 'string' } },
    },
})

describe('endpoint OpenAPI definitions', () => {
    test('keeps inherited semantics, every response/media/example and transitive cyclic refs without mutating input', () => {
        const spec = fixture()
        const before = JSON.stringify(spec)
        const result = operationDefinition(spec, '/things', 'get')
        expect(result.paths['/things'].get).toEqual(spec.paths['/things'].get)
        expect(result.paths['/things'].post).toBeUndefined()
        expect(result.paths['/things'].parameters).toEqual(spec.paths['/things'].parameters)
        expect(result.paths['/things'].servers).toEqual(spec.paths['/things'].servers)
        expect(result.security).toEqual([{ Local: [] }])
        expect(Object.keys(result.components.securitySchemes)).toEqual(['Local'])
        expect(result.components.responses).toEqual(spec.components.responses)
        expect(result.components.schemas).toEqual({ Node: spec.components.schemas.Node })
        expect(JSON.stringify(spec)).toBe(before)
    })

    test('preserves explicit no-auth and falls back to global auth only when absent', () => {
        const spec: any = fixture()
        spec.paths['/things'].get.security = []
        expect(operationDefinition(spec, '/things', 'get').components.securitySchemes).toBeUndefined()
        delete spec.paths['/things'].get.security
        expect(operationDefinition(spec, '/things', 'get').components.securitySchemes).toEqual({ Global: spec.components.securitySchemes.Global })
    })

    test('includes a whole component for escaped pointers into its properties', () => {
        const spec: any = fixture()
        spec.components.schemas['Slash/tilde~'] = { properties: { child: { type: 'string' } } }
        spec.paths['/things'].get.responses['201'] = { schema: { $ref: '#/components/schemas/Slash~1tilde~0/properties/child' } }
        expect(operationDefinition(spec, '/things', 'get').components.schemas['Slash/tilde~']).toEqual(spec.components.schemas['Slash/tilde~'])
    })

    test('fails rather than silently dropping unresolved/external refs or missing operations', () => {
        const spec: any = fixture()
        expect(() => operationDefinition(spec, '/missing', 'get')).toThrow('Missing OpenAPI operation')
        spec.paths['/things'].get.responses['200'].$ref = '#/components/responses/Missing'
        expect(() => operationDefinition(spec, '/things', 'get')).toThrow('Unresolved OpenAPI reference')
        spec.paths['/things'].get.responses['200'].$ref = 'other.json#/Result'
        expect(() => operationDefinition(spec, '/things', 'get')).toThrow('Unsupported OpenAPI reference')
    })

    test('uses a safe Markdown fence and lossless YAML serialization', () => {
        const spec: any = fixture()
        spec.paths['/things'].get.description = 'Example:\n```yaml\n<test>{{value}}</test>\n```'
        const markdown = operationDefinitionMarkdown(spec, '/things', 'get')
        expect(markdown).toContain('````yaml\n')
        const text = markdown.split('````yaml\n')[1].split('````\n')[0]
        expect(yaml.load(text)).toEqual(operationDefinition(spec, '/things', 'get'))
    })

    test.each([['v1', v1], ['v2', v2]])('%s retains every operation exactly and resolves all current references', (_, spec: any) => {
        for (const [path, item] of Object.entries(spec.paths) as [string, any][]) {
            for (const method of ['get', 'put', 'post', 'delete', 'options', 'head', 'patch', 'trace']) {
                if (!item[method]) continue
                const definition = operationDefinition(spec, path, method)
                expect(definition.paths[path][method]).toEqual(item[method])
            }
        }
    })
})
