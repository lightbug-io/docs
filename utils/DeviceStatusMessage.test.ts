import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { parse } from '@vue/compiler-sfc'
import ts from 'typescript'
import { calculateCRC16XMODEM, messageToBytesHelper, parseRawMessage, writeTypedData } from '../src/protocol/base.gen'

import { capturedDocumentationValues, type DocumentationExample } from './MessageDocumentation'

const yaml = require('js-yaml')
const protocol = yaml.load(readFileSync(resolve(__dirname, '../public/files/protocol-v3.yaml'), 'utf8'))
// Exercise the real parser component's computed annotations without its presentation controls.
const { descriptor } = parse(readFileSync(resolve(__dirname, '../components/Protocol/Message.vue'), 'utf8'))
const javascript = ts.transpileModule(descriptor.script!.content, {
    compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS },
}).outputText
const componentExports: any = {}
new Function('require', 'exports', javascript)((id: string) => {
    if (id === 'vitepress') return { withBase: (path: string) => path }
    if (id === './Bytes.vue') return {}
    if (id === '../../utils/ProtocolSentinels') return require('./ProtocolSentinels')
    if (id === '../../src/protocol/base.gen') return require('../src/protocol/base.gen')
    return require(id)
}, componentExports)
function sections(bytes: number[], yamlData = protocol) {
    return componentExports.default.setup({
        byteString: bytes.join(' '), yamlData, readOnly: true, showValidation: true,
    }).byteSections.value
}

// Captured Viper6 FW2763 Device Status frame; other fields remain untouched.
const capture = '4C 42 03 3B 00 22 00 00 00 0D 00 01 08 0C 0D 0E 03 07 0A 09 02 04 05 06 01 4B 02 7B 0F 02 76 01 02 00 80 04 C4 B0 CF 3E 01 00 02 CB 0A 01 39 01 00 01 00 01 04 02 9A 01 02 36 01 70 2C'
    .split(' ').map(byte => parseInt(byte, 16))

it('labels the captured resistance, unavailable temperature and cumulative charge', () => {
    expect(calculateCRC16XMODEM(capture.slice(2, -2))).toBe(capture[capture.length - 2] | capture[capture.length - 1] << 8)
    const annotations = sections(capture)
    expect(annotations.find((section: any) => section.label === 'Battery Resistance')).toMatchObject({
        value: '374', unit: 'mOhm', validation: undefined, isUndefined: false,
    })
    expect(annotations.find((section: any) => section.label === 'Battery Resistance Temperature')).toMatchObject({
        value: 'Unavailable (raw -32768)', unit: undefined, conversion: undefined, validation: undefined,
    })
    const charge = annotations.find((section: any) => section.label === 'Lifetime Battery Charge Received')
    expect(charge).toMatchObject({ unit: 'Ah', validation: undefined, isUndefined: false })
    expect(Number(charge.value)).toBeCloseTo(0.4056454897, 8)
})

it.each([-525, 0, 2300])('converts a valid resistance temperature %i to Celsius', temperature => {
    const message = parseRawMessage(capture)
    message.data[13] = writeTypedData(temperature, 'int16')
    const annotation = sections(messageToBytesHelper(message)).find((section: any) => section.label === 'Battery Resistance Temperature')
    expect(Number(annotation.value)).toBe(temperature / 100)
    expect(annotation.unit).toBe('C')
})

it('uses declared sentinels on arbitrary message and field IDs, before enum labels or conversion', () => {
    const message = parseRawMessage(capture)
    message.messageType = 222
    message.data = { 42: writeTypedData(-32768, 'int16') }
    const yamlData = { messages: { 222: { data: { 42: {
        ...protocol.messages[34].data[13],
        values: { '-32768': { name: 'Must not appear' } },
    } } } } }
    expect(sections(messageToBytesHelper(message), yamlData).find((section: any) => section.label === 'Battery Resistance Temperature')).toMatchObject({
        value: 'Unavailable (raw -32768)', unit: undefined, rawUnit: undefined, conversion: undefined,
        rawBytes: [0, 128], validation: undefined,
    })
})

it('keeps the ordinary int16 minimum when the field does not declare a sentinel', () => {
    const yamlData = JSON.parse(JSON.stringify(protocol))
    delete yamlData.messages[34].data[13].sentinels
    expect(sections(capture, yamlData).find((section: any) => section.label === 'Battery Resistance Temperature')).toMatchObject({
        value: '-327.68', unit: 'C', rawUnit: 'cC', conversion: 100, rawBytes: [0, 128],
    })
})

it('does not invent an unavailable reading when the field is absent', () => {
    const message = parseRawMessage(capture)
    delete message.data[13]
    expect(sections(messageToBytesHelper(message)).some((section: any) => section.label === 'Battery Resistance Temperature')).toBe(false)
})

it('applies declared header sentinels through the same lookup', () => {
    const message = parseRawMessage(capture)
    message.header[42] = writeTypedData(0, 'uint8')
    const yamlData = { ...protocol, header: { ...protocol.header, 42: {
        name: 'Test header', type: 'uint8', conversion: 100, unit: 'C',
        sentinels: { 0: { id: 'unknown', name: 'Unknown' } },
    } } }
    expect(sections(messageToBytesHelper(message), yamlData).find((section: any) => section.label === 'Test header')).toMatchObject({
        value: 'Unknown (raw 0)', unit: undefined, rawUnit: undefined, conversion: undefined,
    })
})

function capturedValues(bytes: number[], definitions = protocol.messages[34].data) {
    const example: DocumentationExample = {
        title: 'Device Status capture', provenance: 'captured',
        frames: [{ role: 'response', label: 'Status', bytes: bytes.join(' ') }],
    }
    return capturedDocumentationValues(example, 34, definitions)
}

it('shares sentinel presentation with captured documentation values', () => {
    expect(capturedValues(capture).find(field => field.id === 13)?.value).toBe('Unavailable (raw -32768)')
    const message = parseRawMessage(capture)
    message.data[13] = writeTypedData(-525, 'int16')
    expect(capturedValues(messageToBytesHelper(message)).find(field => field.id === 13)?.value).toBe('-525 cC (raw)')
    delete message.data[13]
    expect(capturedValues(messageToBytesHelper(message)).some(field => field.id === 13)).toBe(false)
    const definitions = { ...protocol.messages[34].data, 13: { type: 'int16', conversion: 100, 'raw-unit': 'cC', unit: 'C' } }
    expect(capturedValues(capture, definitions).find(field => field.id === 13)?.value).toBe('-32768 cC (raw)')
})
