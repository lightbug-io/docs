import { describe, expect, it } from '@jest/globals'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
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
        expect(commonResponseHeaderIds({ headers: { '3': { presence: 'ignored' }, '4': { value: 0 } } })).toEqual(['4'])
        expect(commonResponseHeaderIds({ headers: { '3': {}, '4': { value: 0 } } })).toEqual(['3', '4'])
    })
    it('keeps MT58 version/payload rules and explicit publication correlation distinct', () => {
        const message = getMessageDocumentation(protocol.messages[58])!
        const get = getOperationVariant(message.operations.find(operation => operation.method === 'GET')!, '2')
        const subscribe = getOperationVariant(message.operations.find(operation => operation.method === 'SUBSCRIBE')!, '2')
        expect(commonResponseHeaderIds(get.response!)).toEqual(['3', '4'])
        expect(get.response?.headers?.['22']).toMatchObject({ presence: 'required', value: 2 })
        expect(get.response?.fields?.['129']).toMatchObject({ maxBytes: 1024 })
        expect(get.response?.fields?.['129'].presence).toBeUndefined()
        expect(resolveDocumentationFields(protocol, protocol.messages[58], get.response?.fields, 'fields').find(field => field.id === 129)?.presence).toBe('optional')
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
        expect(fields[0].presence).toBe('optional') // listed fields default to optional; readonly alone is not required
        expect(resolveDocumentationFields(protocol, protocol.messages[39], {}, 'fields')).toEqual([]) // unlisted fields are not added to this exchange
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

    it('validates references for each migrated message', () => {
        expect(Object.entries(protocol.messages).filter(([, value]: [string, any]) => getMessageDocumentation(value)).map(([id]) => Number(id))).toEqual([34, 35, 39, 58])
        for (const id of [34, 35, 39, 58]) expect(validateMessageDocumentation(protocol, id)).toEqual([])
    })

    it('summarizes every message field within its applicable version', () => {
        for (const id of [34, 35, 39, 58]) {
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

describe('migrated exchange authoring audit', () => {
    const migratedIds = [34, 35, 39, 58]
    const normalized = (value: unknown) => typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : value

    it('does not restate optional presence or inherited metadata in exchange maps', () => {
        const inspectExchange = (message: any, exchange: any) => {
            if (!exchange || typeof exchange !== 'object') return
            for (const role of ['request', 'response', 'publication']) {
                const context = exchange[role]
                if (!context || typeof context !== 'object') continue
                const contextMessage = context.messageId === undefined ? message : protocol.messages[context.messageId]
                for (const kind of ['headers', 'fields'] as const) {
                    const definitions = kind === 'headers' ? protocol.header : contextMessage?.data
                    for (const [id, usage] of Object.entries(context[kind] || {}) as [string, any][]) {
                        const definition = definitions?.[id]
                        expect(usage.presence).not.toBe('optional')
                        if (!definition) continue
                        for (const key of ['description', 'name', 'id', 'type', 'unit', 'maxBytes']) {
                            if (usage[key] !== undefined && definition[key] !== undefined) {
                                expect(normalized(usage[key])).not.toBe(normalized(definition[key]))
                            }
                        }
                        for (const [value, override] of Object.entries(usage.values || {}) as [string, any][]) {
                            const inherited = definition.values?.[value]
                            if (!inherited) continue
                            const inheritedName = typeof inherited === 'string' ? inherited : inherited.name
                            const inheritedDescription = typeof inherited === 'string' ? undefined : inherited.description
                            const localDescription = typeof override === 'string' ? override : override?.description
                            if (typeof override === 'string') expect(normalized(override)).not.toBe(normalized(inheritedName))
                            if (override?.name !== undefined) expect(normalized(override.name)).not.toBe(normalized(inheritedName))
                            if (localDescription !== undefined && inheritedDescription !== undefined) {
                                expect(normalized(localDescription)).not.toBe(normalized(inheritedDescription))
                            }
                            if (localDescription !== undefined) expect(normalized(localDescription)).not.toBe(normalized(inheritedName))
                        }
                    }
                }
            }
        }
        const inspectSource = (message: any, source: any) => {
            if (!source || typeof source !== 'object') return
            if (source.exchange) inspectExchange(message, source.exchange)
            for (const exchange of Object.values(source.versions || {})) inspectExchange(message, exchange)
        }

        for (const id of migratedIds) {
            const message = protocol.messages[id]
            for (const source of Object.values(message.methods || {})) inspectSource(message, source)
            for (const source of Object.values(message.contexts || {})) inspectSource(message, source)
        }
    })

    it('inherits global field names, descriptions and enum labels without changing their rendered values', () => {
        const gps = protocol.messages[39]
        const [gpsField] = resolveDocumentationFields(protocol, gps, { 2: {} }, 'fields')
        const gpsDefinition = gps.data[2]
        expect(gpsField.name).toBe(gpsDefinition.name)
        expect(gpsField.description).toBe(gpsDefinition.description)
        expect(gpsField.values.map(({ value, name, description }: any) => ({ value, name, description }))).toEqual([
            { value: 0, name: gpsDefinition.values[0].name, description: gpsDefinition.values[0].description || '' },
            { value: 1, name: gpsDefinition.values[1].name, description: gpsDefinition.values[1].description || '' },
        ])

        const [methodHeader] = resolveDocumentationFields(protocol, gps, { 5: { presence: 'required', value: 1 } }, 'headers')
        expect(methodHeader.name).toBe(protocol.header[5].name)
        expect(methodHeader.description).toBe(protocol.header[5].description)
        expect(methodHeader.valueName).toBe(protocol.header[5].values[1].name)
    })
})


describe('Device Status reference', () => {
    const message = protocol.messages[34]
    const docs = getMessageDocumentation(message)!
    it('keeps the existing methods and wire fields without inventing a message version', () => {
        expect(Object.keys(message.methods)).toEqual(['GET', 'SUBSCRIBE', 'UNSUBSCRIBE'])
        expect(message.versions).toBeUndefined()
        expect(docs.formats).toBeUndefined()
        expect(Object.entries(message.data).map(([id, field]: [string, any]) => [id, field.id, field.type])).toEqual([
            ['1', 'bat', 'uint8'], ['2', 'signalStrength', 'uint8'], ['3', 'mode', 'uint8'],
            ['4', 'networkType', 'uint8'], ['5', 'mnc', 'uint16'], ['6', 'mcc', 'uint16'],
            ['7', 'fw', 'uint32'], ['10', 'deviceType', 'uint8'],
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
        expect(subscribe.request?.headers?.['17']).toMatchObject({ value: 0 })
        expect(subscribe.request?.headers?.['17'].presence).toBeUndefined()
        expect(resolveDocumentationFields(protocol, message, subscribe.request?.headers, 'headers').find(field => field.id === 17)?.presence).toBe('optional')
        expect(subscribe.publication?.headers?.['4'].presence).toBe('omitted')
        expect(unsubscribe.request?.headers?.['17']).toBeUndefined()
        for (const context of [get.response, subscribe.publication]) {
            expect(Object.keys(context!.fields!)).toEqual(Object.keys(message.data))
            expect(Object.values(context!.fields!).every(field => field.presence === undefined)).toBe(true)
            expect(resolveDocumentationFields(protocol, message, context!.fields, 'fields').every(field => field.presence === 'optional')).toBe(true)
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
            '03 14 00 22 00 02 00 05 01 01 02 04 20 62 84 3E 00 00 C2 E5',
            '03 31 00 22 00 02 00 03 04 04 20 62 84 3E 01 00 08 00 01 03 07 0A 02 04 05 06 01 58 01 00 04 EF 08 00 00 01 30 01 40 01 00 02 00 00 02 00 00 6C 5E',
        ])
        expect(example.frames.every(frame => frame.encoding === 'hex')).toBe(true)
        expect(example.frames[0].normalizedBytes).toEqual([3, 20, 0, 34, 0, 2, 0, 5, 1, 1, 2, 4, 32, 98, 132, 62, 0, 0, 194, 229])
        const frames = example.frames.map(frame => frame.normalizedBytes!)
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
        invalid.frames[1].normalizedBytes!.push(0)
        expect(capturedDocumentationValues(invalid, 34, message.data)).toEqual([])
        const bytes = [...example.frames[1].normalizedBytes!]
        bytes[26] = 255 // Invalid first payload length, even with a recomputed checksum.
        const crc = calculateCRC16XMODEM(bytes.slice(0, -2))
        bytes.splice(-2, 2, crc & 255, crc >> 8)
        invalid.frames[1].normalizedBytes = bytes
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
        expect(Object.values(get.response!.fields!).every(field => field.presence === undefined)).toBe(true)
        expect(resolveDocumentationFields(protocol, message, get.response?.fields, 'fields').every(field => field.presence === 'optional')).toBe(true)
        expect(get.response?.description).toContain('may be stale')
        expect(message.examples).toBeUndefined()
        expect(validateMessageDocumentation(protocol, 35)).toEqual([])
    })
    it('normalizes the original captured ID exchange and verifies its CRC', () => {
        const [example] = get.examples!
        expect(example.provenance).toBe('captured')
        expect(example.frames.every(frame => frame.encoding === 'hex')).toBe(true)
        expect(example.frames[0].normalizedBytes).toEqual([3, 20, 0, 35, 0, 2, 0, 5, 1, 1, 2, 4, 31, 187, 53, 226, 0, 0, 191, 169])
        const [request, response] = example.frames.map(frame => frame.normalizedBytes!)
        for (const bytes of [request, response]) {
            expect(calculateCRC16XMODEM(bytes.slice(0, -2))).toBe(bytes[bytes.length - 2] | bytes[bytes.length - 1] << 8)
            expect(parseRawMessage(bytes)).toMatchObject({ protocolVersion: 3, length: bytes.length, messageType: 35 })
        }
        expect(parseRawMessage(request).data).toEqual({})
        expect(Object.keys(parseRawMessage(response).data)).toEqual(['1', '2', '3'])
    })

    it('preserves and decodes the captured GET pair without inventing serial or SIM2 samples', () => {
        const [example] = get.examples!
        expect(get.examples).toHaveLength(1)
        expect(example.provenance).toBe('captured')
        expect(example.description).toContain('2025-10-10')
        expect(example.description).toContain('RH2 P1 v2287')
        expect(example.target).toBe('RH2 over I2C')
        expect(example.frames.map(frame => frame.role)).toEqual(['request', 'response'])
        expect(example.frames.every(frame => frame.encoding === 'hex')).toBe(true)
        const frames = example.frames.map(frame => frame.normalizedBytes!)
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
