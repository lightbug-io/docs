import { describe, expect, it } from '@jest/globals'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { resolveProtocolInteraction, validateProtocolInteractions } from './ProtocolInteractions'
import { calculateCRC16XMODEM, parseRawMessage, readTypedData } from '../src/protocol/base.gen'
// The repository's YAML dependency is intentionally untyped.
const yaml = require('js-yaml')
import {
    capturedDocumentationValues,
    commonResponseHeaderIds,
    documentationTextParts,
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
const authoredInteraction = (message: any, selector: string): any => Object.values(message.interactions).find((interaction: any) => interaction.method === selector || interaction.anchorId === selector)

describe('Cell Info signal strength terminology', () => {
    it('names raw CSQ as signal strength while preserving the field identity and type', () => {
        expect(protocol.messages[37].data[20]).toEqual({
            name: 'Signal Strength (CSQ)',
            id: 'csq',
            type: 'uint8',
        })
    })
})

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
        expect(documentationExamplesForContext(examples, 'request')[0]).toMatchObject({ exampleIndex: 0, stageTitle: 'Pair request', showNumber: false, startsExchange: true, frames: [{ frameIndex: 0 }] })
        expect(documentationExamplesForContext(examples, 'response')[0]).toMatchObject({ stageTitle: 'Pair response', showNumber: false, startsExchange: false, frames: [{ frameIndex: 1 }] })
        expect(documentationExamplesForContext(examples, 'publication')[0].frames.map(frame => frame.frameIndex)).toEqual([2, 3])
        expect(documentationExamplesForContext(examples, 'publication')[0].stageTitle).toBe('Pair publication')
        expect(documentationExamplesForContext([{ ...examples[0], title: 'GET exchange response' }], 'response')[0].stageTitle).toBe('GET exchange response')
        expect(examples).toEqual(before)
        const pairs = [...examples, ...examples, { ...examples[0], frames: [examples[0].frames[3]] }]
        expect(documentationExamplesForContext(pairs, 'request').map(example => example.exampleIndex)).toEqual([0, 1])
        expect(documentationExamplesForContext(pairs, 'request').every(example => example.showNumber)).toBe(true)
        expect(documentationExamplesForContext(pairs, 'response').map(example => example.exampleIndex)).toEqual([0, 1])
        expect(documentationExamplesForContext(pairs, 'publication')[2]).toMatchObject({ exampleIndex: 2, stageTitle: 'Pair upload', startsExchange: true, frames: [{ frameIndex: 0, role: 'upload' }] })
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

describe('documentation links', () => {
    it('links HTTP(S) references while retaining escaped-text content and unsafe schemes as text', () => {
        const text = 'Reference: https://mcc-mnc.net/ and (https://example.test/code). <b>text</b> javascript:alert(1) data:text/html,test'
        const parts = documentationTextParts(text)
        expect(parts.map(part => part.text).join('')).toBe(text)
        expect(parts.filter(part => part.href).map(part => part.href)).toEqual(['https://mcc-mnc.net/', 'https://example.test/code'])
        expect(documentationTextParts('https://user:secret@example.test/ https://').every(part => !part.href)).toBe(true)
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
        const network = resolveDocumentationFields(protocol, protocol.messages[34], { 4: {} }, 'fields')[0]
        expect(network.values.map(value => [value.value, value.name])).toEqual([[0, 'No network'], [2, 'GSM (2G)'], [3, 'WCDMA (3G)'], [4, 'LTE (4G)']])
        expect(resolveDocumentationFields(protocol, protocol.messages[34], { 4: { values: { 0: 'Disconnected' } } }, 'fields')[0].values).toEqual([{ value: 0, name: 'No network', description: 'Disconnected' }])
        expect(resolveDocumentationFields(protocol, protocol.messages[34], { 4: { value: 0 } }, 'fields')[0].values).toEqual([])
    })

    it('rejects broken inline references and duplicate operation anchors', () => {
        const sample = clone(protocol)
        const message = sample.messages[39]
        delete message.interactions
        message.methods.GET = { exchange: { request: { headers: { 5: { value: 2 } } } } }
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
            const operation = docs.operations.find(item => (item.anchorId || item.id) === id)!
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
        const upload = docs.operations.find(item => (item.anchorId || item.id) === 'tracking-session')!
        expect(documentationTargetOverride(upload.target, docs.target)).toBe(upload.target)
        expect(documentationTargetOverride('Different target', upload.target)).toBe('Different target')
    })

    it('accepts a response payload scoped to its actual ACK message', () => {
        const sample = clone(protocol)
        authoredInteraction(sample.messages[39], 'SET').versions[1].response = { messageId: 5, fields: { 1: { value: 39 } } }
        expect(validateMessageDocumentation(sample, 39)).toEqual([])
    })

    it('validates references for each migrated message', () => {
        expect(Object.entries(protocol.messages).filter(([, value]: [string, any]) => getMessageDocumentation(value)).map(([id]) => Number(id))).toEqual([31, 33, 34, 35, 39, 58])
        for (const id of [31, 33, 34, 35, 39, 58]) expect(validateMessageDocumentation(protocol, id)).toEqual([])
    })

    it('summarizes every message field within its applicable version', () => {
        for (const id of [31, 33, 34, 35, 39, 58]) {
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
            expect(Object.prototype.hasOwnProperty.call(method || {}, 'request')).toBe(false)
            expect(Object.prototype.hasOwnProperty.call(method || {}, 'response')).toBe(false)
        }
    })

    it('rejects unknown versions, bad applicability and inconsistent wire selectors', () => {
        const sample = clone(protocol)
        const message = sample.messages[58]
        message.data[129].versions = [9]
        authoredInteraction(message, 'SET').versions[9] = { ...authoredInteraction(message, 'SET').versions[1], messageVersion: 9 }
        authoredInteraction(message, 'GET').versions[2].response.headers[22].value = 1
        const errors = validateMessageDocumentation(sample, 58).join('\n')
        expect(errors).toContain('field 129 references unknown version 9')
        expect(errors).toContain('references unknown message version 9')
        expect(errors).toContain('uses field 129 outside its versions')
        expect(errors).toContain('header 22 disagrees with its message version')
        message.data[129].versions = {}
        expect(validateMessageDocumentation(sample, 58).join('\n')).toContain('versions must be a nonempty list')
    })

    it('rejects malformed inline contexts before normalization can conceal them', () => {
        for (const update of [
            (message: any) => { authoredInteraction(message, 'SET').versions[1].request.fields[2] = null },
            (message: any) => { authoredInteraction(message, 'SET').versions[1].request = 'broken' },
            (message: any) => { message.contexts = [] },
            (message: any) => { message.contexts = { tracking: null } },
        ]) {
            const sample = clone(protocol)
            update(sample.messages[39])
            expect(validateMessageDocumentation(sample, 39).length).toBeGreaterThan(0)
        }
        const sample = clone(protocol)
        authoredInteraction(sample.messages[58], 'GET').versions[2].response.fields[2] = null
        expect(validateMessageDocumentation(sample, 58).join('\n')).toContain('fields 2 must be an object')
    })

    it('keeps version identity and deep links stable when a display label changes', () => {
        const sample = clone(protocol)
        const message = sample.messages[58]
        message.versions[2].label = '2027-02'
        const docs = getMessageDocumentation(message)!
        const get = docs.operations.find(operation => (operation.anchorId || operation.id) === 'get')!
        expect(get.variants!.map(variant => variant.id)).toEqual(['2', '1'])
        expect(getOperationVariant(get).format).toBe('2')
        expect(getOperationVariant(get, 'v2').format).toBe('2')
        expect(getOperationVariant(get, 'v1').format).toBe('1')
        expect(docs.formats![0]).toMatchObject({ id: '2', label: '2027-02', messageVersion: 2, anchorId: 'current' })
        expect(validateMessageDocumentation(sample, 58)).toEqual([])
    })

    it('inherits existing method field descriptions before base descriptions', () => {
        const message = clone(protocol.messages[39])
        delete authoredInteraction(message, 'SET').versions[1].request.fields[2].description
        const docs = getMessageDocumentation(message)!
        const set = docs.operations.find(operation => operation.method === 'SET')!
        expect(set.request!.fields![2].description).toBe(message.methods.SET.request[2].description)
        expect(authoredInteraction(message, 'SET').versions[1].request.fields[2].description).toBeUndefined()
    })

    it('keeps ignored checksums out of SET inputs without deleting the compatibility rule', () => {
        const set = authoredInteraction(protocol.messages[58], 'SET').versions[1]
        expect(Object.keys(set!.request!.fields)).toEqual(['129'])
        expect(set.request.description).toContain('checksum fields 1 and 2 are ignored')
        expect(set!.request!.fields[129]).toMatchObject({ presence: 'required', maxBytes: 1024 })
        const get = authoredInteraction(protocol.messages[58], 'GET').versions[2]
        expect(get.response.fields[2].presence).toBe('required')
    })
})


describe('Device Status reference', () => {
    const message = protocol.messages[34]
    const docs = getMessageDocumentation(message)!
    it('documents optional fields 12–14 in GET responses and later publications', () => {
        const message = protocol.messages[34];
        expect(message.data[12]).toMatchObject({ id: 'batteryResistance', type: 'uint16', unit: 'mOhm' });
        expect(message.data[13]).toMatchObject({ id: 'batteryResistanceTemperature', type: 'int16', conversion: 100, unit: 'C' });
        expect(message.data[13].sentinels[-32768]).toMatchObject({ id: 'unavailable', name: 'Unavailable' });
        const fields = resolveDocumentationFields(protocol, message, docs.fields, 'fields');
        expect(fields.find(field => field.id === 13)?.sentinels).toEqual(message.data[13].sentinels);
        expect(message.data[14]).toMatchObject({ id: 'batteryChargeAh', type: 'float32', unit: 'Ah' });
        for (const context of [message.methods.GET.exchange.response, message.methods.SUBSCRIBE.exchange.publication]) {
            for (const id of [12, 13, 14]) expect(context.fields[id]).toEqual({ presence: 'optional' });
        }
        expect(validateMessageDocumentation(protocol, 34)).toEqual([]);
    });
    it('keeps the existing methods and wire fields without inventing a message version', () => {
        expect(Object.keys(message.methods)).toEqual(['GET', 'SUBSCRIBE', 'UNSUBSCRIBE'])
        expect(message.versions).toBeUndefined()
        expect(docs.formats).toBeUndefined()
        expect(Object.entries(message.data).map(([id, field]: [string, any]) => [id, field.id, field.type])).toEqual([
            ['1', 'bat', 'uint8'], ['2', 'signalStrength', 'uint8'], ['3', 'mode', 'uint8'],
            ['4', 'networkType', 'uint8'], ['5', 'mnc', 'uint16'], ['6', 'mcc', 'uint16'],
            ['7', 'fw', 'uint32'], ['10', 'deviceType', 'uint8'],
            ['12', 'batteryResistance', 'uint16'], ['13', 'batteryResistanceTemperature', 'int16'],
            ['14', 'batteryChargeAh', 'float32'],
        ])
        for (const operation of docs.operations) {
            expect(operation.messageVersion).toBeUndefined()
            expect(operation.request?.headers?.['22']).toBeUndefined()
        }
        expect(message.header).toEqual([5])
        expect(validateMessageDocumentation(protocol, 34)).toEqual([])
    })
    it('separates direct replies, setup acknowledgments and later publications', () => {
        const [get, subscribe, unsubscribe] = docs.operations
        expect([get, subscribe, unsubscribe].map(operation => operation.request?.headers?.['5'])).toEqual([
            { presence: 'required', value: 2 }, { presence: 'required', value: 3 }, { presence: 'required', value: 5 },
        ])
        expect(get.response?.messageId).toBeUndefined()
        expect(subscribe.response?.messageId).toBe(5)
        expect(unsubscribe.response?.messageId).toBe(5)
        expect(subscribe.publication?.headers?.['3'].presence).toBe('omitted')
        expect(subscribe.request?.headers?.['17']).toMatchObject({ presence: 'optional', value: 0 })
        expect(unsubscribe.request?.headers?.['17']).toBeUndefined()
        for (const context of [get.response, subscribe.publication]) {
            expect(Object.keys(context!.fields!)).toEqual(Object.keys(message.data))
            expect(Object.values(context!.fields!).every(field => field.presence === 'optional')).toBe(true)
        }
        expect(subscribe.examples).toBeUndefined()
        expect(unsubscribe.examples).toBeUndefined()
    })
    it('preserves the captured GET pair byte-for-byte and validates correlation and CRCs', () => {
        const [example] = docs.operations[0].examples!
        expect(example.provenance).toBe('captured')
        expect(example.description).toContain('2025-10-10')
        expect(example.target).toBe('RH2 over I2C')
        expect(example.frames.map(frame => frame.role)).toEqual(['request', 'response'])
        expect(example.frames.map(frame => frame.bytes)).toEqual([
            '3 20 0 34 0 2 0 5 1 1 2 4 32 98 132 62 0 0 194 229',
            '3 49 0 34 0 2 0 3 4 4 32 98 132 62 1 0 8 0 1 3 7 10 2 4 5 6 1 88 1 0 4 239 8 0 0 1 48 1 64 1 0 2 0 0 2 0 0 108 94',
        ])
        const frames = example.frames.map(frame => frame.bytes.split(' ').map(Number))
        for (const bytes of frames) {
            expect(calculateCRC16XMODEM(bytes.slice(0, -2))).toBe(bytes[bytes.length - 2] | bytes[bytes.length - 1] << 8)
            expect(parseRawMessage(bytes)).toMatchObject({ protocolVersion: 3, length: bytes.length, messageType: 34 })
        }
        const [request, response] = frames.map(parseRawMessage)
        expect(request.data).toEqual({})
        expect(request.header[5]).toEqual([2])
        expect(response.header[3]).toEqual(request.header[1])
        expect(response.header[4]).toEqual([0])
        expect(Object.fromEntries(Object.entries(response.data).map(([id, bytes]) => [id, readTypedData(bytes, message.data[id].type)]))).toEqual({
            1: 88, 2: 64, 3: 0, 4: 0, 5: 0, 6: 0, 7: 2287, 10: 48,
        })
        expect(Object.fromEntries(capturedDocumentationValues(example, 34, message.data).map(field => [field.id, field.value]))).toEqual({
            1: '88%', 2: '64%', 3: '0 · Sleep', 4: '0 · No network', 5: '0', 6: '0', 7: '2287', 10: '48',
        })
        expect(capturedDocumentationValues({ ...example, frames: [example.frames[0]] }, 34, message.data)).toEqual([])
    })
    it('does not project generated, wrong-message, unverified-version or malformed examples as captures', () => {
        const example = docs.operations[0].examples![0]
        expect(capturedDocumentationValues({ ...example, provenance: 'generated' }, 34, message.data)).toEqual([])
        expect(capturedDocumentationValues(example, 58, message.data)).toEqual([])
        expect(capturedDocumentationValues(example, 34, message.data, 2)).toEqual([])
        const invalid = clone(example)
        invalid.frames[1].bytes += ' 0'
        expect(capturedDocumentationValues(invalid, 34, message.data)).toEqual([])
        const bytes = example.frames[1].bytes.split(' ').map(Number)
        bytes[26] = 255 // Invalid first payload length, even with a recomputed checksum.
        const crc = calculateCRC16XMODEM(bytes.slice(0, -2))
        bytes.splice(-2, 2, crc & 255, crc >> 8)
        invalid.frames[1].bytes = bytes.join(' ')
        expect(capturedDocumentationValues(invalid, 34, message.data)).toEqual([])
        const badType = { ...message.data, 7: { ...message.data[7], type: 'uint8' } }
        expect(capturedDocumentationValues(example, 34, badType).some(field => field.id === 7)).toBe(false)
        const converted = { ...message.data, 1: { ...message.data[1], ...Object.values(protocol.messages).map((entry: any) => entry.data?.[5]).find((field: any) => field?.['raw-unit'] === 'cm') as object, type: 'uint8' } }
        expect(capturedDocumentationValues(example, 34, converted).find(field => field.id === 1)?.value).toBe('88 cm (raw)')
    })
})

describe('Device IDs reference', () => {
    const message = protocol.messages[35]
    const docs = getMessageDocumentation(message)!
    const get = docs.operations[0]

    it('keeps GET unversioned and preserves every wire field, including uncaptured identifiers', () => {
        expect(Object.keys(message.methods)).toEqual(['GET'])
        expect(message.header).toEqual([5])
        expect(message.versions).toBeUndefined()
        expect(docs.formats).toBeUndefined()
        expect(get.request?.headers?.['22']).toBeUndefined()
        expect(get.request?.headers?.['5']).toEqual({ presence: 'required', value: 2 })
        expect(get.request?.fields).toBeUndefined()
        expect(Object.entries(message.data).map(([id, field]: [string, any]) => [id, field.id, field.type])).toEqual([
            ['1', 'id', 'uint'], ['2', 'imei', 'ascii'], ['3', 'iccid', 'ascii'],
            ['4', 'serial', 'uint32'], ['8', 'cachedIccid2', 'ascii'],
        ])
        expect(Object.keys(get.response!.fields!)).toEqual(Object.keys(message.data))
        expect(Object.values(get.response!.fields!).every(field => field.presence === 'optional')).toBe(true)
        expect(get.response?.description).toContain('may be stale')
        expect(message.examples).toBeUndefined()
        expect(validateMessageDocumentation(protocol, 35)).toEqual([])
    })

    it('preserves and decodes the captured GET pair without inventing serial or SIM2 samples', () => {
        const [example] = get.examples!
        expect(get.examples).toHaveLength(1)
        expect(example.provenance).toBe('captured')
        expect(example.description).toContain('2025-10-10')
        expect(example.description).toContain('RH2 P1 v2287')
        expect(example.target).toBe('RH2 over I2C')
        expect(example.frames.map(frame => frame.role)).toEqual(['request', 'response'])
        expect(example.frames.map(frame => frame.bytes)).toEqual([
            '3 20 0 35 0 2 0 5 1 1 2 4 31 187 53 226 0 0 191 169',
            '3 65 0 35 0 2 0 3 4 4 31 187 53 226 1 0 3 0 1 2 3 4 3 109 161 0 15 56 54 52 57 53 48 48 54 48 50 49 50 53 56 55 20 56 57 52 53 55 51 48 48 48 48 48 48 50 50 50 49 52 56 48 54 6 251',
        ])
        const frames = example.frames.map(frame => frame.bytes.split(' ').map(Number))
        for (const bytes of frames) {
            expect(calculateCRC16XMODEM(bytes.slice(0, -2))).toBe(bytes[bytes.length - 2] | bytes[bytes.length - 1] << 8)
            expect(parseRawMessage(bytes)).toMatchObject({ protocolVersion: 3, length: bytes.length, messageType: 35 })
        }
        const [request, response] = frames.map(parseRawMessage)
        expect(request.data).toEqual({})
        expect(request.header[5]).toEqual([2])
        expect(response.header[3]).toEqual(request.header[1])
        expect(response.header[4]).toEqual([0])
        expect(Object.fromEntries(Object.entries(response.data).map(([id, bytes]) => [id, readTypedData(bytes, message.data[id].type)]))).toEqual({
            1: 10579203, 2: '864950060212587', 3: '89457300000022214806',
        })
        expect(Object.fromEntries(capturedDocumentationValues(example, 35, message.data).map(field => [field.id, field.value]))).toEqual({
            1: '10579203', 2: '864950060212587', 3: '89457300000022214806',
        })
        expect(documentationExamplesForContext(get.examples!, 'request')[0].stageTitle).toBe('GET exchange request')
        expect(documentationExamplesForContext(get.examples!, 'response')[0].stageTitle).toBe('GET exchange response')
    })
})

describe('canonical inline interactions', () => {
    it('uses inline interactions as the only documentation source without mutating wire definitions', () => {
        const before = clone(protocol)
        expect(protocol.interactions).toBeUndefined()
        expect(validateProtocolInteractions(protocol)).toEqual([])
        for (const messageId of [31, 33, 34, 35, 39, 58]) {
            const message = protocol.messages[messageId]
            const docs = getMessageDocumentation(message)!
            expect(docs.operations.map(operation => operation.id)).toEqual(Object.keys(message.interactions))
            expect(message.contexts).toBeUndefined()
            for (const method of Object.values(message.methods) as any[]) {
                expect(method?.exchange).toBeUndefined()
                expect(method?.versions).toBeUndefined()
            }
            for (const [id, source] of Object.entries(message.interactions) as [string, any][]) {
                for (const revision of Object.keys(source.versions).map(Number)) {
                    const interaction = resolveProtocolInteraction(protocol, messageId, id, revision)
                    expect(interaction).toMatchObject({ interactionId: id, interactionVersion: revision, messageId, operationId: id })
                }
            }
        }
        expect(protocol).toEqual(before)
        const duplicate = clone(protocol)
        duplicate.messages[39].methods.GET.exchange = { request: {} }
        expect(validateMessageDocumentation(duplicate, 39).join('\n')).toContain('must not also be authored in methods or contexts')
    })

    it('keeps interaction revisions independent from wire formats, including revisions above 255', () => {
        const sample = clone(protocol)
        const source = sample.messages[58].interactions['replace-message-box']
        source.versions[700] = source.versions[1]
        delete source.versions[1]
        const resolved = resolveProtocolInteraction(sample, 58, 'replace-message-box', 700)
        expect(resolved).toMatchObject({ id: 'replace-message-box', interactionVersion: 700, messageVersion: 2, format: '2', anchorId: 'set' })
        expect(resolved.request?.headers?.[22].value).toBe(2)
        expect(resolved.response?.messageId).toBe(5)
        expect(resolved.response?.fields?.[1].value).toBe(58)
        const upload = resolveProtocolInteraction(protocol, 58, 'tracking-message-box-upload', 1)
        expect(upload.publication).toBeDefined()
        expect(upload.request).toBeUndefined()
        expect(upload.method).toBeUndefined()
        expect(resolveProtocolInteraction(protocol, 58, 'stop-message-box-subscription', 1).messageVersion).toBeUndefined()
    })

    it('supports applicability revisions of one wire format with distinct revision anchors', () => {
        const sample = clone(protocol)
        const source = sample.messages[58].interactions['replace-message-box']
        delete source.versions[1].anchorId
        source.versions[2] = { ...clone(source.versions[1]), target: 'A different caller profile' }
        expect(validateMessageDocumentation(sample, 58)).toEqual([])
        const operation = getMessageDocumentation(sample.messages[58])!.operations.find(item => item.id === 'replace-message-box')!
        expect(operation.variants!.map(variant => [variant.id, variant.anchorId, variant.messageVersion])).toEqual([
            ['2', 'r2', 2], ['1', 'r1', 2],
        ])
        expect(resolveProtocolInteraction(sample, 58, 'replace-message-box', 2).target).toBe('A different caller profile')
        expect(resolveProtocolInteraction(sample, 58, 'replace-message-box', 1).target).toBe(sample.messages[58].target)
    })

    it('keeps old method and context documentation readable when no inline interactions exist', () => {
        const legacy = {
            description: 'Legacy documentation', data: {}, methods: {
                GET: { title: 'Read', exchange: { request: { headers: { 5: { value: 2 } } }, response: { fields: {} } } },
            }, contexts: { upload: { exchange: { publication: { fields: {} } } } },
        }
        const docs = getMessageDocumentation(legacy)!
        expect(docs.operations.map(operation => operation.id)).toEqual(['get', 'upload'])
        expect(docs.operations[0].method).toBe('GET')
        expect(docs.operations[1].publication).toBeDefined()
        expect(validateMessageDocumentation({ ...protocol, messages: { 39: legacy } }, 39)).toEqual([])
    })

    it('models GSM controls and SIM choices without changing their SDK method maps', () => {
        const gsm = protocol.messages[31]
        const sim = protocol.messages[33]
        expect(gsm.methods).toEqual({ GET: null, SET: null })
        expect(sim.methods).toEqual({ GET: null, SET: null })
        const flight = resolveProtocolInteraction(protocol, 31, 'control-flight-mode', 1)
        const search = resolveProtocolInteraction(protocol, 31, 'start-search', 1)
        expect(flight.request?.fields?.[5].presence).toBe('omitted')
        expect(search.request?.fields?.[5].presence).toBe('required')
        const sim1 = resolveProtocolInteraction(protocol, 33, 'select-sim1', 1)
        const sim2 = resolveProtocolInteraction(protocol, 33, 'select-sim2', 1)
        expect(sim1.request?.fields?.[1].value).toBe(0)
        expect(sim2.request?.fields?.[1].value).toBe(1)
        expect(sim2.request?.fields?.[2]).toMatchObject({ presence: 'required', minBytes: 1 })
        expect(sim.data[8].readonly).toBe(true)
        expect(sim1.response?.messageId).toBe(5)
    })

    it.each([
        ['unknown property', (source: any) => { source.context = 'old-alias' }],
        ['invalid title', (source: any) => { source.title = 4 }],
        ['empty revisions', (source: any) => { source.versions = {} }],
        ['zero revision', (source: any) => { source.versions = { 0: source.versions[1] } }],
        ['unsafe revision', (source: any) => { source.versions = { '9007199254740992': source.versions[1] } }],
        ['missing wire selector', (source: any) => { delete source.versions[1].messageVersion }],
        ['unknown wire selector', (source: any) => { source.versions[1].messageVersion = 99 }],
        ['unknown revision property', (source: any) => { source.versions[1].wireVersion = 2 }],
        ['empty exchange', (source: any) => { source.versions = { 1: { messageVersion: 2 } } }],
        ['unknown field', (source: any) => { source.versions[1].request.fields[999] = {} }],
        ['method disagreement', (source: any) => { source.versions[1].request.headers[5].value = 2 }],
        ['unknown message', (source: any) => { source.versions[1].response.messageId = 65534 }],
        ['invalid minBytes', (source: any) => { source.versions[1].request.fields[129].minBytes = -1 }],
        ['conflicting byte bounds', (source: any) => { source.versions[1].request.fields[129].minBytes = 1025 }],
    ])('rejects %s before resolving an interaction', (_label, change) => {
        const sample = clone(protocol)
        change(sample.messages[58].interactions['replace-message-box'])
        expect(validateMessageDocumentation(sample, 58).length).toBeGreaterThan(0)
        expect(() => resolveProtocolInteraction(sample, 58, 'replace-message-box', 1)).toThrow()
    })
})
