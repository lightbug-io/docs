import { describe, expect, it } from '@jest/globals'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
// The repository's YAML dependency is intentionally untyped.
const yaml = require('js-yaml')
import {
    commonResponseHeaderIds,
    documentationExamplesForContext,
    getMessageDocumentation,
    getOperationVariant,
    getDocumentationFormat,
    documentationTargetOverride,
    resolveDocumentationFields,
    validateMessageDocumentation,
    type DocumentationOperation,
} from './MessageDocumentation'

const protocol: any = yaml.load(readFileSync(resolve(__dirname, '../public/files/protocol-v3.yaml'), 'utf8'))
const clone = (value: any) => JSON.parse(JSON.stringify(value))

describe('paired exchange stages', () => {
    it('groups frame metadata by stage without mutating order or anchor indices', () => {
        // Metadata-only fixture; this test does not assert protocol packet bytes.
        const examples = [{ title: 'Pair', provenance: 'generated' as const, frames: [
            { role: 'request' as const, label: 'Request', bytes: '' },
            { role: 'response' as const, label: 'Response', bytes: '' },
            { role: 'publication' as const, label: 'Publication', bytes: '' },
            { role: 'upload' as const, label: 'Upload', bytes: '' },
        ] }]
        const before = clone(examples)
        expect(documentationExamplesForContext(examples, 'request')[0]).toMatchObject({ exampleIndex: 0, startsExchange: true, frames: [{ frameIndex: 0 }] })
        expect(documentationExamplesForContext(examples, 'response')[0]).toMatchObject({ startsExchange: false, frames: [{ frameIndex: 1 }] })
        expect(documentationExamplesForContext(examples, 'publication')[0].frames.map(frame => frame.frameIndex)).toEqual([2, 3])
        expect(examples).toEqual(before)
        const pairs = [...examples, ...examples, { ...examples[0], frames: [examples[0].frames[3]] }]
        expect(documentationExamplesForContext(pairs, 'request').map(example => example.exampleIndex)).toEqual([0, 1])
        expect(documentationExamplesForContext(pairs, 'response').map(example => example.exampleIndex)).toEqual([0, 1])
        expect(documentationExamplesForContext(pairs, 'publication')[2]).toMatchObject({ exampleIndex: 2, startsExchange: true, frames: [{ frameIndex: 0, role: 'upload' }] })
        expect(documentationExamplesForContext([], 'request')).toEqual([])
    })
    it('allows documentation without wire examples while retaining existing examples on unmigrated pages', () => {
        for (const id of [39, 58]) {
            const message = protocol.messages[id]
            expect(message.examples).toBeUndefined()
            const docs = getMessageDocumentation(message)!
            for (const operation of docs.operations) for (const variant of operation.variants || [operation]) {
                expect(getOperationVariant(operation, variant.id).examples).toBeUndefined()
            }
            expect(validateMessageDocumentation(protocol, id)).toEqual([])
        }
        expect(getMessageDocumentation(protocol.messages[5])).toBeUndefined()
        expect(protocol.messages[5].examples.some((example: any) => example.bytes && example.real)).toBe(true)
    })
})

describe('shared response conventions', () => {
    it('links ordinary correlation/status rules without removing wire metadata', () => {
        const context = { headers: { '3': { presence: 'optional' as const }, '4': { presence: 'optional' as const, value: 0 }, '22': { presence: 'required' as const, value: 2 } } }
        const before = clone(context)
        expect(commonResponseHeaderIds(context)).toEqual(['3', '4'])
        expect(context).toEqual(before)
    })
    it('keeps explicit exceptions and non-OK status rules local', () => {
        expect(commonResponseHeaderIds({ headers: { '3': { presence: 'omitted' }, '4': { presence: 'required', value: 4 } } })).toEqual([])
        expect(commonResponseHeaderIds({ headers: { '3': { presence: 'optional', description: 'A message-specific correlation rule.' }, '4': { presence: 'required', value: 0, maxBytes: 1 } } })).toEqual([])
    })
    it('keeps MT58 version/payload rules and explicit publication correlation distinct', () => {
        const message = getMessageDocumentation(protocol.messages[58])!
        const get = getOperationVariant(message.operations.find(operation => operation.method === 'GET')!, '2')
        const subscribe = getOperationVariant(message.operations.find(operation => operation.method === 'SUBSCRIBE')!, '2')
        expect(commonResponseHeaderIds(get.response!)).toEqual(['3', '4'])
        expect(get.response?.headers?.['22']).toMatchObject({ presence: 'required', value: 2 })
        expect(get.response?.fields?.['129']).toMatchObject({ presence: 'optional', maxBytes: 1024 })
        expect(subscribe.publication?.headers?.['3'].presence).toBe('omitted')
    })
    it('corrects only the Processing display label, preserving the existing SDK identifier', () => {
        expect(protocol.header[4].values[-1]).toMatchObject({ name: 'Processing', id: 'error' })
        expect(protocol.header[4].type).toBe('int8')
    })
    it('removes example-generation filler from message documentation', () => {
        for (const id of [39, 58]) expect(JSON.stringify(protocol.messages[id])).not.toContain('Every generated request below')
    })
})
describe('optional message documentation', () => {
    it('leaves legacy messages on their existing renderer', () => {
        const legacy = { description: 'Existing prose', methods: { GET: null }, data: {} }
        expect(getMessageDocumentation(legacy)).toBeUndefined()
        expect(validateMessageDocumentation({ messages: { 15: legacy } }, 15)).toEqual([])
        expect(getMessageDocumentation(protocol.messages[15])).toBeUndefined()
    })

    it('inherits operation contexts and selects variants without mutating either', () => {
        const operation: DocumentationOperation = {
            id: 'read', title: 'Read', method: 'GET',
            request: { headers: { 5: { value: 2 } } },
            variants: [
                { id: 'legacy', title: 'Legacy', messageVersion: 1 },
                { id: 'current', title: 'Current', messageVersion: 2, response: { fields: { 129: {} } } },
            ],
        }
        const before = clone(operation)
        expect(getOperationVariant(operation).messageVersion).toBe(1)
        expect(getOperationVariant(operation, 'missing').messageVersion).toBe(1)
        expect(getOperationVariant(operation, 'current')).toMatchObject({
            messageVersion: 2, request: operation.request, response: { fields: { 129: {} } },
        })
        expect(operation).toEqual(before)
    })

    it('resolves shared definitions, per-message descriptions and header values by ID', () => {
        const before = clone(protocol.header[5])
        const headers = resolveDocumentationFields(protocol, protocol.messages[58], {
            5: { value: 1, description: 'Write the complete cached payload.', presence: 'required' },
        }, 'headers')
        expect(headers[0]).toMatchObject({ id: 5, name: 'Method', value: 1, valueName: 'SET', presence: 'required', description: 'Write the complete cached payload.' })
        expect(protocol.header[5]).toEqual(before)
        const fields = resolveDocumentationFields(protocol, protocol.messages[39], { 1: {} }, 'fields')
        expect(fields[0].description).toBe(protocol.messages[39].data[1].description)
        expect(fields[0].presence).toBeUndefined() // readonly does not imply required
        const ack = resolveDocumentationFields(protocol, protocol.messages[5], { 1: {} }, 'fields')
        expect(ack[0].name).toBe(protocol.messages[5].data[1].name)
        expect(ack[0].name).not.toBe(protocol.messages[58].data[1].name)
    })

    it('rejects broken inline references and duplicate operation anchors', () => {
        const sample = clone(protocol)
        const message = sample.messages[39]
        message.notes = [{ id: 'detail', title: 'Detail', description: 'Text', placement: 'unknown' }]
        message.methods.UNSUPPORTED = { exchange: {
            request: { headers: { 5: { value: 99 }, 250: {} }, fields: { 99: {} } },
            response: { messageId: 9999 },
        } }
        message.contexts = { get: { exchange: {} } }
        const errors = validateMessageDocumentation(sample, 39).join('\n')
        expect(errors).toContain('duplicate operation id get')
        expect(errors).toContain('unsupported method UNSUPPORTED')
        expect(errors).toContain('unknown value 99')
        expect(errors).toContain('unknown headers id 250')
        expect(errors).toContain('unknown fields id 99')
        expect(errors).toContain('unknown message 9999')
        expect(errors).toContain('invalid note placement')
    })

    it('puts required fields first while preserving order within each group', () => {
        const usage = {
            1: { presence: 'optional' as const },
            4: { presence: 'required' as const },
            5: { presence: 'required' as const },
            17: { presence: 'omitted' as const },
            22: { presence: 'optional' as const },
        }
        const before = clone(usage)
        expect(resolveDocumentationFields(protocol, protocol.messages[58], usage, 'headers').map(field => field.id)).toEqual([4, 5, 1, 17, 22])
        expect(usage).toEqual(before)
        const set = getMessageDocumentation(protocol.messages[58])!.operations.find((operation: DocumentationOperation) => operation.method === 'SET')
        expect(resolveDocumentationFields(protocol, protocol.messages[58], set!.request!.headers, 'headers').map(field => field.id)).toEqual([5, 22, 1])
        expect(resolveDocumentationFields(protocol, protocol.messages[58], set!.request!.fields, 'fields')[0].id).toBe(129)
    })

    it('accepts optional reference-note placement while retaining the overview default', () => {
        const sample = clone(protocol)
        sample.messages[39].notes = [
            { id: 'purpose', title: 'Purpose', description: 'Overview text' },
            { id: 'detail', title: 'Details', description: 'Reference text', placement: 'reference' },
        ]
        expect(validateMessageDocumentation(sample, 39)).toEqual([])
    })

    it('groups dated formats by their wire selector without classifying shared controls as current', () => {
        const docs = getMessageDocumentation(protocol.messages[58])!
        expect(docs.formats?.map(format => [format.label, format.messageVersion, !!format.legacy])).toEqual([
            ['2026-10', 2, false], ['2025-10', 1, true],
        ])
        for (const id of ['get', 'set', 'subscribe', 'tracking-session']) {
            const operation = docs.operations.find(item => item.id === id)!
            expect(getDocumentationFormat(docs, getOperationVariant(operation))?.id).toBe('2')
        }
        for (const method of ['GET', 'SUBSCRIBE']) {
            const operation = docs.operations.find(item => item.method === method)!
            expect(getDocumentationFormat(docs, getOperationVariant(operation, 'v1'))?.id).toBe('1')
        }
        expect(getDocumentationFormat(docs, docs.operations.find(item => item.method === 'UNSUBSCRIBE')!)).toBeUndefined()
        expect(getMessageDocumentation(protocol.messages[39])!.formats).toBeUndefined()
        const syncParagraphs = docs.notes!.find(note => note.id === 'sync-lifecycle')!.description.trim().split('\n\n')
        expect(syncParagraphs).toHaveLength(3)
        expect(syncParagraphs.every(paragraph => !paragraph.includes('\n'))).toBe(true)
    })

    it('rejects invalid numeric versions, labels and legacy flags', () => {
        const sample = clone(protocol)
        sample.messages[58].versions[2].label = ''
        sample.messages[58].versions[1].legacy = 'yes'
        sample.messages[58].versions['2026-10'] = { label: 'Not a numeric identity' }
        const errors = validateMessageDocumentation(sample, 58).join('\n')
        expect(errors).toContain('2 version needs a label')
        expect(errors).toContain('1 has invalid legacy flag')
        expect(errors).toContain('invalid message version 2026-10')
    })

    it('suppresses inherited targets but retains explicit overrides', () => {
        expect(documentationTargetOverride(undefined, 'Viper devices only')).toBeUndefined()
        expect(documentationTargetOverride(' Viper  devices ONLY ', 'Viper devices only')).toBeUndefined()
        const docs = getMessageDocumentation(protocol.messages[58])!
        const upload = docs.operations.find(item => item.id === 'tracking-session')!
        expect(documentationTargetOverride(upload.target, docs.target)).toBe(upload.target)
        expect(documentationTargetOverride('Different target', upload.target)).toBe('Different target')
    })

    it('accepts a response payload scoped to its actual ACK message', () => {
        const sample = clone(protocol)
        sample.messages[39].methods.SET.exchange.response = { messageId: 5, fields: { 1: { value: 39 } } }
        expect(validateMessageDocumentation(sample, 39)).toEqual([])
    })

    it('migrates only GPS Control and Message Box and validates their references', () => {
        expect(Object.entries(protocol.messages).filter(([, value]: [string, any]) => getMessageDocumentation(value)).map(([id]) => Number(id))).toEqual([39, 58])
        for (const id of [39, 58]) expect(validateMessageDocumentation(protocol, id)).toEqual([])
    })

    it('summarizes every message field within its applicable version', () => {
        for (const id of [39, 58]) {
            const docs = getMessageDocumentation(protocol.messages[id])!
            const groups = docs.formats?.map(format => format.fields || {}) || [docs.fields || {}]
            expect(groups.flatMap(fields => Object.keys(fields)).sort()).toEqual(Object.keys(protocol.messages[id].data).sort())
        }
        const formats = getMessageDocumentation(protocol.messages[58])!.formats!
        expect(Object.keys(formats.find(format => format.id === '2')!.fields!)).toEqual(['2', '129'])
        expect(Object.keys(formats.find(format => format.id === '1')!.fields!)).toEqual(['1', '10', '11', '12', '13', '14'])
    })

    it('makes Message Box v2 primary while retaining explicit legacy v1 variants', () => {
        const docs = getMessageDocumentation(protocol.messages[58])!
        for (const method of ['GET', 'SUBSCRIBE']) {
            const operation = docs.operations.find(item => item.method === method)!
            expect(getOperationVariant(operation).messageVersion).toBe(2)
            expect(getOperationVariant(operation).legacy).not.toBe(true)
            const legacy = operation.variants!.filter(variant => variant.legacy)
            expect(legacy).toHaveLength(1)
            expect(legacy[0].messageVersion).toBe(1)
        }
    })
})

describe('inline numeric-version authoring', () => {
    it('normalizes numeric keys in newest-first order without changing the source', () => {
        const before = clone(protocol)
        const message = protocol.messages[58]
        expect(Object.keys(message.versions)).toEqual(['1', '2'])
        expect(message.data[129].versions).toEqual([2])
        expect(message.data[1].versions).toEqual([1])
        const docs = getMessageDocumentation(message)!
        expect(docs.formats!.map(format => format.id)).toEqual(['2', '1'])
        expect(docs.formats!.map(format => format.label)).toEqual(['2026-10', '2025-10'])
        expect(docs.formats![1].anchorId).toBe('legacy')
        expect(docs.formats![0].anchorId).toBe('current')
        expect(docs.formats![0].fields).toEqual({ 2: {}, 129: {} })
        for (const version of Object.values(message.versions) as any[]) {
            expect(version.id).toBeUndefined()
            expect(version.messageVersion).toBeUndefined()
        }
        expect(protocol).toEqual(before)
    })

    it('preserves direct SDK request/response map presence and field IDs', () => {
        const gps = protocol.messages[39].methods
        expect(gps.GET.request).toBeNull()
        expect(gps.GET.response).toEqual({ 1: null, 2: null })
        expect(Object.keys(gps.SET.request)).toEqual(['2', '3'])
        expect(gps.SET.request[2].description).toBe('Automatically controls the GPS module.')
        expect(gps.SET.response).toBeNull()
        for (const method of Object.values(protocol.messages[58].methods) as any[]) {
            expect(Object.prototype.hasOwnProperty.call(method, 'request')).toBe(false)
            expect(Object.prototype.hasOwnProperty.call(method, 'response')).toBe(false)
        }
    })

    it('rejects unknown versions, bad applicability and inconsistent wire selectors', () => {
        const sample = clone(protocol)
        const message = sample.messages[58]
        message.data[129].versions = [9]
        message.methods.SET.versions[9] = message.methods.SET.versions[2]
        message.methods.GET.versions[2].response.headers[22].value = 1
        const errors = validateMessageDocumentation(sample, 58).join('\n')
        expect(errors).toContain('field 129 references unknown version 9')
        expect(errors).toContain('SET references unknown version 9')
        expect(errors).toContain('uses field 129 outside its versions')
        expect(errors).toContain('header 22 disagrees with its message version')
        message.data[129].versions = {}
        expect(validateMessageDocumentation(sample, 58).join('\n')).toContain('versions must be a nonempty list')
    })

    it('rejects malformed inline contexts before normalization can conceal them', () => {
        for (const update of [
            (message: any) => { message.methods.SET.exchange.request.fields[2] = null },
            (message: any) => { message.methods.SET.exchange.request = 'broken' },
            (message: any) => { message.contexts = [] },
            (message: any) => { message.contexts = { tracking: null } },
        ]) {
            const sample = clone(protocol)
            update(sample.messages[39])
            expect(validateMessageDocumentation(sample, 39).length).toBeGreaterThan(0)
        }
        const sample = clone(protocol)
        sample.messages[58].methods.GET.versions[2].response.fields[2] = null
        expect(validateMessageDocumentation(sample, 58).join('\n')).toContain('fields 2 must be an object')
    })

    it('keeps version identity and deep links stable when a display label changes', () => {
        const sample = clone(protocol)
        const message = sample.messages[58]
        message.versions[2].label = '2027-02'
        const docs = getMessageDocumentation(message)!
        const get = docs.operations.find(operation => operation.id === 'get')!
        expect(get.variants!.map(variant => variant.id)).toEqual(['2', '1'])
        expect(getOperationVariant(get).format).toBe('2')
        expect(getOperationVariant(get, 'v2').format).toBe('2')
        expect(getOperationVariant(get, 'v1').format).toBe('1')
        expect(docs.formats![0]).toMatchObject({ id: '2', label: '2027-02', messageVersion: 2, anchorId: 'current' })
        expect(validateMessageDocumentation(sample, 58)).toEqual([])
    })

    it('inherits existing method field descriptions before base descriptions', () => {
        const message = clone(protocol.messages[39])
        delete message.methods.SET.exchange.request.fields[2].description
        const docs = getMessageDocumentation(message)!
        const set = docs.operations.find(operation => operation.method === 'SET')!
        expect(set.request!.fields![2].description).toBe(message.methods.SET.request[2].description)
        expect(message.methods.SET.exchange.request.fields[2].description).toBeUndefined()
    })

    it('keeps ignored checksums out of SET inputs without deleting the compatibility rule', () => {
        const set = protocol.messages[58].methods.SET.versions[2]
        expect(Object.keys(set!.request!.fields)).toEqual(['129'])
        expect(set.request.description).toContain('checksum fields 1 and 2 are ignored')
        expect(set!.request!.fields[129]).toMatchObject({ presence: 'required', maxBytes: 1024 })
        const get = protocol.messages[58].methods.GET.versions[2]
        expect(get.response.fields[2].presence).toBe('required')
    })
})
