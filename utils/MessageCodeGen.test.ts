import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { compileScript, parse } from '@vue/compiler-sfc'
import { createApp, nextTick, type App } from 'vue'
import ts from 'typescript'

const yaml = require('js-yaml')
const protocol = yaml.load(readFileSync(resolve(__dirname, '../public/files/protocol-v3.yaml'), 'utf8'))
const source = readFileSync(resolve(__dirname, '../components/Protocol/MessageCodeGen.vue'), 'utf8')
const { descriptor } = parse(source, { filename: 'MessageCodeGen.vue' })
const compiled = compileScript(descriptor, { id: 'message-code-gen-test' })
const javascript = ts.transpileModule(compiled.content, {
    compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS },
}).outputText
const componentExports: { default?: any } = {}
new Function('require', 'exports', javascript)(require, componentExports)

describe('Cell Info code examples', () => {
    let app: App
    let host: HTMLDivElement
    let component: any

    beforeEach(async () => {
        localStorage.clear()
        host = document.createElement('div')
        document.body.appendChild(host)
        // Exercise the actual component's mounted data loading and computed code,
        // without the unrelated Vuetify controls and syntax highlighter.
        app = createApp({ ...componentExports.default, render: () => null }, {
            messageId: 37,
            yamlData: protocol,
        })
        component = app.mount(host)
        await nextTick()
    })

    afterEach(() => {
        app.unmount()
        host.remove()
        localStorage.clear()
    })

    test.each(['go', 'ts', 'toit', 'cpp', 'cs'])('%s uses the renamed CSQ constant with field number 20', async language => {
        component.activeTab = language
        await nextTick()
        expect(component.currentCode).toMatch(/\b(?:MD_CELL_INFO_)?SIGNAL_STRENGTH_CSQ\b.*(?:=|::=) 20/)
        expect(component.currentCode).not.toContain('SIGNAL_STRENGTH_(CSQ)')
        expect(component.currentCode).not.toContain('CARRIER_SQUELCH')
        expect(protocol.messages[37].data[20].name).toBe('Signal Strength (CSQ)')
    })

    it('uses the same identifier in grouped Go constants', async () => {
        component.toggleGoFormat()
        await nextTick()
        expect(component.currentCode).toContain('MD_CELL_INFO_SIGNAL_STRENGTH_CSQ = 20')
    })
})
