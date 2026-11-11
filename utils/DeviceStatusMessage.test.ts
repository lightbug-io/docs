import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { parse } from '@vue/compiler-sfc'
import ts from 'typescript'
import { calculateCRC16XMODEM, messageToBytesHelper, parseRawMessage, writeTypedData } from '../src/protocol/base.gen'

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
    if (id === '../../src/protocol/base.gen') return require('../src/protocol/base.gen')
    return require(id)
}, componentExports)
function sections(bytes: number[]) {
    return componentExports.default.setup({
        byteString: bytes.join(' '), yamlData: protocol, readOnly: true, showValidation: true,
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
