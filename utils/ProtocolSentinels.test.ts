import { readFileSync } from 'node:fs'
import path from 'node:path'
import { compileScript, parse } from '@vue/compiler-sfc'
import { createSSRApp, type Component } from 'vue'
import { renderToString } from '@vue/server-renderer'
import ts from 'typescript'
import { formatSentinelValue } from './ProtocolSentinels'

const field = { sentinels: {
    '-32768': { id: 'unavailable', name: 'Unavailable', description: 'No reading' },
    '0': { id: 'unknown', name: 'Unknown' },
} }

it('matches declared raw numeric scalars, including zero and bigint', () => {
    expect(formatSentinelValue(-32768, field)).toBe('Unavailable (raw -32768)')
    expect(formatSentinelValue(-32768n, field)).toBe('Unavailable (raw -32768)')
    expect(formatSentinelValue(0, field)).toBe('Unknown (raw 0)')
})

it.each([-525, 2300, undefined, null, '-32768', [-32768], NaN, Infinity])('does not coerce %s into a sentinel', value => {
    expect(formatSentinelValue(value, field)).toBeUndefined()
})

it('does not inherit undeclared sentinel values or render malformed labels', () => {
    expect(formatSentinelValue(-32768, {})).toBeUndefined()
    expect(formatSentinelValue(-32768, { sentinels: Object.create(field.sentinels) })).toBeUndefined()
    expect(formatSentinelValue(-32768, { sentinels: { '-32768': { id: 'unavailable', name: '' } } })).toBeUndefined()
})

const { descriptor } = parse(readFileSync(path.join(__dirname, '../components/Protocol/SentinelValues.vue'), 'utf8'))
const compiled = compileScript(descriptor, { id: 'sentinel-values-test', inlineTemplate: true })
const javascript = ts.transpileModule(compiled.content, {
    compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS },
}).outputText
const componentExports: { default?: Component } = {}
new Function('require', 'exports', javascript)(require, componentExports)

it('renders sentinel metadata in field documentation without treating it as an enum', async () => {
    const html = await renderToString(createSSRApp(componentExports.default!, field))
    expect(html).toContain('Sentinel values (raw, without conversion or units)')
    expect(html).toContain('<code>-32768</code>')
    expect(html).toContain('Unavailable')
    expect(html).toContain('No reading')
    expect(html).toContain('<code>0</code>')
    expect(html).not.toContain('-327.68')
    expect(html).not.toContain('Possible values')
})

it('does not add sentinel documentation to ordinary fields', async () => {
    const html = await renderToString(createSSRApp(componentExports.default!, {}))
    expect(html).not.toContain('sentinel-values')
})
