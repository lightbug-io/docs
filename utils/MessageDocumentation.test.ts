import { describe, expect, it } from '@jest/globals'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
// The repository's YAML dependency is intentionally untyped.
const yaml = require('js-yaml')
import {
    getMessageDocumentation,
    getOperationVariant,
    resolveDocumentationFields,
    validateMessageDocumentation,
    type DocumentationOperation,
} from './MessageDocumentation'
import { parseByteString } from './ByteStringParser'
import { calculateCRC16XMODEM, messageToBytesHelper, parseRawMessage, readUint16LE } from '../src/protocol/base.gen'

const protocol: any = yaml.load(readFileSync(resolve(__dirname, '../public/files/protocol-v3.yaml'), 'utf8'))
const clone = (value: any) => JSON.parse(JSON.stringify(value))

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
        const sample = clone(protocol)
        sample.messages[39].docs = {
            summary: 'Test',
            fields: { 98: {} },
            legacyFields: { 97: {} },
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
    })

    it('accepts a response payload scoped to its actual ACK message', () => {
        const sample = clone(protocol)
        sample.messages[39].docs = {
            summary: 'Test', operations: [{ id: 'write', title: 'Write', method: 'SET',
                response: { messageId: 5, fields: { 1: { value: 39 } } },
            }],
        }
        expect(validateMessageDocumentation(sample, 39)).toEqual([])
    })

    it('migrates only GPS Control and Message Box and validates their references', () => {
        expect(Object.entries(protocol.messages).filter(([, value]: [string, any]) => value.docs).map(([id]) => Number(id))).toEqual([39, 58])
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
        expect(Object.keys(protocol.messages[58].docs.fields)).toEqual(['2', '129'])
        expect(Object.keys(protocol.messages[58].docs.legacyFields)).toEqual(['1', '10', '11', '12', '13', '14'])
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
