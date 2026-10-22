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
import { parseByteString } from './ByteStringParser'
import { calculateCRC16XMODEM, messageToBytesHelper, parseRawMessage, readUint16LE } from '../src/protocol/base.gen'

const protocol: any = yaml.load(readFileSync(resolve(__dirname, '../public/files/protocol-v3.yaml'), 'utf8'))
const clone = (value: any) => JSON.parse(JSON.stringify(value))

describe('paired exchange stages', () => {
    it('renders every documented frame once while preserving its exchange/frame index', () => {
        let count = 0
        for (const id of [39, 58]) for (const operation of getMessageDocumentation(protocol.messages[id])!.operations) {
            for (const variant of operation.variants?.map(item => getOperationVariant(operation, item.id)) || [operation]) {
                const examples = variant.examples || []
                const frames = (['request', 'response', 'publication'] as const).flatMap(role => documentationExamplesForContext(examples, role)
                    .flatMap(example => example.frames.map(frame => ({ example: example.exampleIndex, index: frame.frameIndex, bytes: frame.bytes }))))
                const expected = examples.flatMap((example, index) => example.frames.map((frame, frameIndex) => ({ example: index, index: frameIndex, bytes: frame.bytes })))
                const key = (frame: { example: number; index: number }) => frame.example * 100 + frame.index
                expect(frames.sort((a, b) => key(a) - key(b))).toEqual(expected)
                count += frames.length
            }
        }
        expect(count).toBe(22)
    })
    it('aligns subscription frames with their stage without losing frame anchors', () => {
        const docs = getMessageDocumentation(protocol.messages[58])!
        const subscribe = getOperationVariant(docs.operations.find(operation => operation.method === 'SUBSCRIBE')!, '2026-10')
        const before = clone(subscribe.examples)
        const request = documentationExamplesForContext(subscribe.examples!, 'request')
        const response = documentationExamplesForContext(subscribe.examples!, 'response')
        const updates = documentationExamplesForContext(subscribe.examples!, 'publication')
        expect(request[0]).toMatchObject({ exampleIndex: 0, startsExchange: true, frames: [{ frameIndex: 0, role: 'request' }] })
        expect(response[0]).toMatchObject({ exampleIndex: 0, startsExchange: false, frames: [{ frameIndex: 1, role: 'response' }] })
        expect(updates[0].frames.map(frame => frame.frameIndex)).toEqual([2, 3])
        expect(subscribe.examples).toEqual(before)
    })
    it('keeps multiple request/reply pairs identifiable and uploads in their own context', () => {
        const docs = getMessageDocumentation(protocol.messages[58])!
        const set = getOperationVariant(docs.operations.find(operation => operation.method === 'SET')!, '2026-10')
        expect(documentationExamplesForContext(set.examples!, 'request').map(example => example.exampleIndex)).toEqual([0, 1])
        expect(documentationExamplesForContext(set.examples!, 'response').map(example => example.exampleIndex)).toEqual([0, 1])
        const upload = docs.operations.find(operation => operation.id === 'tracking-session')!
        expect(documentationExamplesForContext(upload.examples!, 'publication')[0].frames[0].role).toBe('upload')
        expect(documentationExamplesForContext(upload.examples!, 'request')).toEqual([])
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
        const get = getOperationVariant(message.operations.find(operation => operation.method === 'GET')!, '2026-10')
        const subscribe = getOperationVariant(message.operations.find(operation => operation.method === 'SUBSCRIBE')!, '2026-10')
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
// Keep the PR's previous authoring shape covered without a second large YAML fixture.
const legacyProtocol = () => {
    const sample = clone(protocol)
    for (const id of [39, 58]) {
        const message = sample.messages[id]
        message.docs = clone(getMessageDocumentation(message))
        for (const operation of message.docs.operations) {
            delete operation.format
            for (const variant of operation.variants || []) delete variant.format
        }
        delete message.versions
        delete message.contexts
        for (const method of Object.values(message.methods) as any[]) {
            if (method) { delete method.versions; delete method.exchange }
        }
    }
    return sample
}


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

    it('rejects broken references and duplicate anchors before generation', () => {
        const sample = legacyProtocol()
        sample.messages[39].docs = {
            summary: 'Test',
            fields: { 98: {} },
            legacyFields: { 97: {} },
            notes: [{ id: 'detail', title: 'Detail', description: 'Text', placement: 'unknown' }],
            operations: [
                { id: 'read', title: 'Read', method: 'UNSUPPORTED', legacy: 'yes', request: { headers: { 5: { value: 99 }, 250: {} }, fields: { 99: {} } }, response: { messageId: 9999 } },
                { id: 'read', title: 'Duplicate' },
            ],
        }
        const errors = validateMessageDocumentation(sample, 39).join('\n')
        expect(errors).toContain('duplicate operation id read')
        expect(errors).toContain('unsupported method UNSUPPORTED')
        expect(errors).toContain('unknown value 99')
        expect(errors).toContain('unknown headers id 250')
        expect(errors).toContain('unknown fields id 99')
        expect(errors).toContain('unknown message 9999')
        expect(errors).toContain('field summary references unknown fields id 98')
        expect(errors).toContain('legacy field summary references unknown fields id 97')
        expect(errors).toContain('invalid legacy flag')
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
        const sample = legacyProtocol()
        sample.messages[39].docs.notes = [
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
            expect(getDocumentationFormat(docs, getOperationVariant(operation))?.id).toBe('2026-10')
        }
        for (const method of ['GET', 'SUBSCRIBE']) {
            const operation = docs.operations.find(item => item.method === method)!
            expect(getDocumentationFormat(docs, getOperationVariant(operation, 'v1'))?.id).toBe('2025-10')
        }
        expect(getDocumentationFormat(docs, docs.operations.find(item => item.method === 'UNSUBSCRIBE')!)).toBeUndefined()
        expect(getMessageDocumentation(protocol.messages[39])!.formats).toBeUndefined()
        const syncParagraphs = docs.notes!.find(note => note.id === 'sync-lifecycle')!.description.trim().split('\n\n')
        expect(syncParagraphs).toHaveLength(3)
        expect(syncParagraphs.every(paragraph => !paragraph.includes('\n'))).toBe(true)
    })

    it('rejects ambiguous format definitions and mismatched operation membership', () => {
        const sample = legacyProtocol()
        const docs = sample.messages[58].docs
        docs.formats.push({ id: '2026-10', label: '', messageVersion: 2, legacy: 'yes' })
        docs.operations.find((item: DocumentationOperation) => item.id === 'set').messageVersion = 9
        docs.operations.find((item: DocumentationOperation) => item.id === 'get').variants[1].legacy = false
        const errors = validateMessageDocumentation(sample, 58).join('\n')
        expect(errors).toContain('duplicate format id 2026-10')
        expect(errors).toContain('needs a format label')
        expect(errors).toContain('duplicate format messageVersion 2')
        expect(errors).toContain('invalid format legacy flag')
        expect(errors).toContain('unknown format messageVersion 9')
        expect(errors).toContain('disagrees with its format legacy flag')
    })

    it('suppresses inherited targets but retains actual operation and example exceptions', () => {
        expect(documentationTargetOverride(undefined, 'Viper devices only')).toBeUndefined()
        expect(documentationTargetOverride(' Viper  devices ONLY ', 'Viper devices only')).toBeUndefined()
        const docs = getMessageDocumentation(protocol.messages[58])!
        const upload = docs.operations.find(item => item.id === 'tracking-session')!
        expect(documentationTargetOverride(upload.target, docs.target)).toBe(upload.target)
        expect(documentationTargetOverride(upload.examples![0].target, upload.target)).toBe(upload.examples![0].target)
        for (const operation of getMessageDocumentation(protocol.messages[39])!.operations) {
            expect(operation.examples!.every(example => !example.target)).toBe(true)
        }
    })

    it('accepts a response payload scoped to its actual ACK message', () => {
        const sample = legacyProtocol()
        sample.messages[39].docs = {
            summary: 'Test', operations: [{ id: 'write', title: 'Write', method: 'SET',
                response: { messageId: 5, fields: { 1: { value: 39 } } },
            }],
        }
        expect(validateMessageDocumentation(sample, 39)).toEqual([])
    })

    it('migrates only GPS Control and Message Box and validates their references', () => {
        expect(Object.entries(protocol.messages).filter(([, value]: [string, any]) => getMessageDocumentation(value)).map(([id]) => Number(id))).toEqual([39, 58])
        for (const id of [39, 58]) expect(validateMessageDocumentation(protocol, id)).toEqual([])
    })

    it('summarizes every message field without mixing current and legacy-only fields', () => {
        for (const id of [39, 58]) {
            const docs = getMessageDocumentation(protocol.messages[id])!
            const current = Object.keys(docs.fields || {})
            const legacy = Object.keys(docs.legacyFields || {})
            expect([...current, ...legacy].sort()).toEqual(Object.keys(protocol.messages[id].data).sort())
            expect(current.filter(key => legacy.includes(key))).toEqual([])
        }
        expect(Object.keys(getMessageDocumentation(protocol.messages[58])!.fields!)).toEqual(['2', '129'])
        expect(Object.keys(getMessageDocumentation(protocol.messages[58])!.legacyFields!)).toEqual(['1', '10', '11', '12', '13', '14'])
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
            expect(legacy[0].examples!.length).toBeGreaterThan(0)
        }
    })
})

describe('inline date-keyed authoring', () => {
    it('normalizes without changing the source or adding a second authored version ID', () => {
        const before = clone(protocol)
        const message = protocol.messages[58]
        expect(message.docs).toBeUndefined()
        expect(Object.keys(message.versions)).toEqual(['2026-10', '2025-10'])
        expect(message.data[129].versions).toEqual(['2026-10'])
        expect(message.data[1].versions).toEqual(['2025-10'])
        const docs = getMessageDocumentation(message)!
        expect(docs.formats!.map(format => format.id)).toEqual(['2026-10', '2025-10'])
        expect(docs.formats![1].anchorId).toBe('legacy')
        expect(docs.formats![0].anchorId).toBe('current') // Retain the already published deep link.
        expect(docs.formats![0].fields).toEqual({ 2: {}, 129: {} })
        for (const version of Object.values(message.versions) as any[]) {
            expect(version.id).toBeUndefined()
            expect(version.label).toBeUndefined()
            expect(version.messageVersion).toBeUndefined()
        }
        expect(protocol).toEqual(before)
    })

    it('keeps the previous docs schema and unmigrated pages working', () => {
        const previous = legacyProtocol()
        expect(getMessageDocumentation(previous.messages[58])).toBe(previous.messages[58].docs)
        expect(validateMessageDocumentation(previous, 58)).toEqual([])
        expect(getMessageDocumentation(previous.messages[15])).toBeUndefined()
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

    it('rejects unknown dates, bad applicability and inconsistent wire selectors', () => {
        const sample = clone(protocol)
        const message = sample.messages[58]
        message.data[129].versions = ['2099-10']
        message.methods.SET.versions['2099-10'] = message.methods.SET.versions['2026-10']
        message.methods.GET.versions['2026-10'].response.headers[22].value = 1
        const errors = validateMessageDocumentation(sample, 58).join('\n')
        expect(errors).toContain('field 129 references unknown version 2099-10')
        expect(errors).toContain('SET references unknown version 2099-10')
        expect(errors).toContain('uses field 129 outside its versions')
        expect(errors).toContain('inconsistent header 22 values')
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
        sample.messages[58].methods.GET.versions['2026-10'].response.fields[2] = null
        expect(validateMessageDocumentation(sample, 58).join('\n')).toContain('fields 2 must be an object')
    })

    it('keeps semantic dates distinct when two formats use the same wire selector', () => {
        const sample = clone(protocol)
        const message = sample.messages[58]
        message.versions['2026-11'] = { description: 'Another semantic revision using the same wire format.' }
        message.methods.GET.versions['2026-11'] = clone(message.methods.GET.versions['2026-10'])
        for (const field of Object.values(message.data) as any[]) {
            if (field.versions?.includes('2026-10')) field.versions.push('2026-11')
        }
        const docs = getMessageDocumentation(message)!
        const get = docs.operations.find(operation => operation.id === 'get')!
        expect(get.variants!.map(variant => variant.id)).toEqual(['2026-10', '2025-10', '2026-11'])
        expect(getOperationVariant(get).format).toBe('2026-10')
        expect(getOperationVariant(get, '2026-11').format).toBe('2026-11')
        expect(getOperationVariant(get, 'v2').format).toBe('2026-10')
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
        const set = protocol.messages[58].methods.SET.versions['2026-10']
        expect(Object.keys(set!.request!.fields)).toEqual(['129'])
        expect(set.request.description).toContain('checksum fields 1 and 2 are ignored')
        expect(set!.request!.fields[129]).toMatchObject({ presence: 'required', maxBytes: 1024 })
        const get = protocol.messages[58].methods.GET.versions['2026-10']
        expect(get.response.fields[2].presence).toBe('required')
    })
})

describe('documented generated wire examples', () => {
    for (const id of [39, 58]) {
        it(`validates every MT${id} frame, checksum, operation and request/response pairing`, () => {
            const docs = getMessageDocumentation(protocol.messages[id])
            expect(docs).toBeDefined()
            let count = 0
            for (const operation of docs!.operations) {
                const views = operation.variants?.length
                    ? operation.variants.map(variant => getOperationVariant(operation, variant.id))
                    : [operation]
                for (const view of views) {
                    expect(view.examples?.length).toBeGreaterThan(0)
                    for (const example of view.examples || []) {
                        expect(example.provenance).toBe('generated')
                        const frames = example.frames.map(frame => {
                            const bytes = parseByteString(frame.bytes).bytes
                            const parsed = parseRawMessage(bytes)
                            expect(parsed.protocolVersion).toBe(3)
                            expect(parsed.length).toBe(bytes.length)
                            expect(calculateCRC16XMODEM(bytes.slice(0, -2))).toBe(readUint16LE(bytes, bytes.length - 2))
                            expect(messageToBytesHelper(parsed)).toEqual(bytes)
                            count++
                            if (frame.role === 'request') {
                                expect(parsed.messageType).toBe(id)
                                if (operation.method) {
                                    const methodEntry = Object.entries(protocol.header[5].values).find(([, item]: [string, any]) => item.name === operation.method)
                                    expect(parsed.header[5]).toEqual([Number(methodEntry?.[0])])
                                }
                            }
                            if (frame.role === 'response') expect(parsed.messageType).toBe(view.response?.messageId || id)
                            if (frame.role === 'publication' || frame.role === 'upload') expect(parsed.messageType).toBe(id)
                            if (id === 58 && parsed.messageType === id && view.messageVersion !== undefined) {
                                expect(parsed.header[22]?.[0] ?? 1).toBe(view.messageVersion)
                            }
                            const context = frame.role === 'upload' ? view.publication : view[frame.role]
                            for (const kind of ['headers', 'fields'] as const) {
                                const fields = kind === 'headers' ? parsed.header : parsed.data
                                for (const [key, usage] of Object.entries(context?.[kind] || {})) {
                                    const value = fields[Number(key)]
                                    if (usage.presence === 'required') expect(value).toBeDefined()
                                    if (usage.presence === 'omitted') expect(value).toBeUndefined()
                                    if (value && usage.maxBytes !== undefined) expect(value.length).toBeLessThanOrEqual(usage.maxBytes)
                                    if (value && usage.value !== undefined) expect(value.reduce((sum, byte, index) => sum + byte * 2 ** (8 * index), 0)).toBe(usage.value)
                                }
                            }
                            if (id === 58 && ['response', 'publication'].includes(frame.role) && parsed.messageType === 58) {
                                if (parsed.header[22]?.[0] === 2) {
                                    expect(readUint16LE(parsed.data[2]!, 0)).toBe(calculateCRC16XMODEM(parsed.data[129] || []))
                                } else {
                                    const payload = [10, 11, 12, 13, 14].flatMap(field => parsed.data[field] || [])
                                    expect(readUint16LE(parsed.data[1]!, 0)).toBe(payload.reduce((sum, byte) => sum + byte, 0) % 65536)
                                }
                            }
                            return { ...frame, parsed }
                        })
                        const request = frames.find(frame => frame.role === 'request')
                        for (const response of frames.filter(frame => frame.role === 'response')) {
                            expect(request).toBeDefined()
                            expect(request!.parsed.header[1]?.length).toBeGreaterThan(0)
                            expect(response.parsed.header[3]).toEqual(request!.parsed.header[1])
                            if (response.parsed.messageType === 5) expect(readUint16LE(response.parsed.data[1]!, 0)).toBe(id)
                        }
                        for (const event of frames.filter(frame => frame.role === 'publication' || frame.role === 'upload')) {
                            expect(event.parsed.header[3]).toBeUndefined()
                        }
                    }
                }
            }
            expect(count).toBeGreaterThan(0)
        })
    }

    it('documents Message Box clearing with a present, zero-length payload', () => {
        const docs = getMessageDocumentation(protocol.messages[58])!
        const set = docs.operations.find(operation => operation.method === 'SET')!
        const examples = getOperationVariant(set).examples || []
        const requests = examples.flatMap(example => example.frames).filter(frame => frame.role === 'request').map(frame => parseRawMessage(parseByteString(frame.bytes).bytes))
        expect(requests.some(request => request.header[22]?.[0] === 2 && request.data[129]?.length === 0)).toBe(true)
    })
})
