/** Actual SSR output for the lightweight capability introduction and device box. */
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { compileScript, parse } from '@vue/compiler-sfc'
import { createSSRApp, h, type Component } from 'vue'
import { renderToString } from '@vue/server-renderer'
import ts from 'typescript'

function component(filename: string): Component {
    const file = path.join(__dirname, '../components', filename)
    const { descriptor } = parse(readFileSync(file, 'utf8'), { filename })
    const compiled = compileScript(descriptor, { id: 'capability-overview-test', inlineTemplate: true })
    const javascript = ts.transpileModule(compiled.content, {
        compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS },
    }).outputText
    const exports: { default?: Component } = {}
    const resolve = (name: string) => name === 'vitepress'
        ? { withBase: (link: string) => `/docs/pr/40${link}` }
        : name.endsWith('.vue') ? { default: component(path.basename(name)), __esModule: true } : require(name)
    new Function('require', 'exports', javascript)(resolve, exports)
    return exports.default!
}

const CapabilityDevices = component('CapabilityDevices.vue')
const CapabilityOverview = component('CapabilityOverview.vue')

describe('lightweight capability presentation', () => {
    test('renders current links only, with a short WIP label and no revision paragraphs', async () => {
        const html = await renderToString(createSSRApp(CapabilityDevices, { capability: 'four-power-leds' }))
        expect(html).toContain('Current devices')
        expect(html).toContain('Documented so far')
        expect(html).toContain('/docs/pr/40/devices/pro/')
        expect(html).toContain('/docs/pr/40/devices/zero/')
        expect(html).not.toContain('PR2')
        expect(html).not.toContain('revision')
        expect(html).not.toContain('hardware')
        expect((html.match(/<li/g) || [])).toHaveLength(4)
    })

    test('keeps feature prose before the device aside in reading order', async () => {
        const html = await renderToString(createSSRApp({
            render: () => h(CapabilityOverview, { capability: 'rgb-status-leds' }, () => h('p', 'The feature comes first.')),
        }))
        expect(html.indexOf('The feature comes first.')).toBeLessThan(html.indexOf('<aside'))
        expect(html).toContain('Handheld RTK (RH2)')
        expect((html.match(/<li/g) || [])).toHaveLength(1)
    })
})
