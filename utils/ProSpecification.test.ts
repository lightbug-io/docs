/** Exercise the same merged PR3 YAML through the page's table and PDF components. */
import { readFileSync, existsSync } from 'node:fs'
import path from 'node:path'
import { compileScript, parse } from '@vue/compiler-sfc'
import { createSSRApp, defineComponent, h, type Component } from 'vue'
import { renderToString } from '@vue/server-renderer'
import ts from 'typescript'
const yaml = require('js-yaml')

const root = path.join(__dirname, '..')
const read = (file: string) => readFileSync(path.join(root, file), 'utf8')
const page = read('devices/pro/index.md')
function specForPage(file: string) {
    const specPath = read(file).match(/import spec from '([^']+)\?raw'/)![1]
    return yaml.load(readFileSync(path.resolve(root, path.dirname(file), specPath), 'utf8'))
}
const spec = specForPage('devices/pro/index.md')
const sectionNames = ['physical', 'integrations', 'user interface', 'connectivity', 'positioning', 'sensors', 'battery', 'charging', 'components']
let capturedPdf: any

function evaluate(source: string) {
    const javascript = ts.transpileModule(source, {
        compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS, esModuleInterop: true },
    }).outputText
    const exports: Record<string, any> = {}
    const resolve = (name: string): any => {
        if (name === 'vitepress') return { withBase: (url: string) => `/docs/pr/40${url}` }
        if (name.endsWith('/useDeviceSpec.js')) return evaluate(read('composables/useDeviceSpec.js'))
        if (name === './DownloadPdfButton.vue') return { __esModule: true, default: defineComponent({
            props: ['getPdfData', 'label'],
            setup(props) {
                capturedPdf = props.getPdfData()
                return () => h('button', props.label)
            },
        }) }
        return require(name)
    }
    new Function('require', 'exports', javascript)(resolve, exports)
    return exports
}

function component(filename: string): Component {
    const { descriptor } = parse(read(`components/${filename}`), { filename })
    return evaluate(compileScript(descriptor, { id: 'pro-spec-test', inlineTemplate: true }).content).default
}
const Overview = component('DeviceSpecOverview.vue')
const Section = component('DeviceSpecSection.vue')
const Download = component('DownloadSpecButton.vue')

function plainText(html: string) {
    const el = document.createElement('div')
    el.innerHTML = html
    return el.textContent || ''
}

async function pdfFor(input: any, deviceTitle?: string) {
    capturedPdf = undefined
    await renderToString(createSSRApp(Download, { spec: input, deviceTitle, label: 'Download PR3 PDF' }))
    return capturedPdf
}

describe('Pro3 specification integration', () => {
    test('binds the overview, all nine sections and PDF to the current specification', () => {
        expect(spec.product).toMatchObject({ name: 'Pro', sku: 'PR3', prefix: 52, version: 3 })
        expect(page).toContain('const specs = loadSpec(spec)')
        expect(page).toContain('<DeviceSpecOverview :spec="specs" />')
        expect(page).toContain('<DownloadSpecButton :spec="specs" deviceTitle="Pro (PR3)" label="Download PR3 PDF" />')
        expect([...page.matchAll(/<DeviceSpecSection :spec="specs" sectionName="([^"]+)"/g)].map(match => match[1])).toEqual(sectionNames)
    })

    test('keeps current and legacy navigation pointing to the correct generation', () => {
        const config = read('.vitepress/config.mts')
        expect(config).toMatch(/text: 'Pro',\s+link: '\/devices\/pro\/'/)
        expect(config).toMatch(/text: 'ProN \(PR2\)',\s+link: '\/devices\/history\/PR2'/)
        expect(config).toContain("link: '/devices/history/#out-of-production'")
        expect(read('devices.md')).toContain("'/devices/pro/'")
        const [current, legacy] = read('devices/history/index.md').split('## Out of Production')
        expect(current).toContain('](/devices/pro/)')
        expect(current).not.toContain('SKU: PR2')
        expect(legacy).toContain('](/devices/history/PR2)')
        expect(page).toContain('](/devices/history/PR2)')
        expect(read('devices/history/PR2.md')).toContain('](/devices/pro/)')
        // Preserve existing deep links independently of headings and layout.
        expect(page).toMatch(/\bid=["']pro-pr2["']/)
        expect(read('devices/history/PR2.md')).toContain('{#pro-pr2}')
    })

    test('both generation pages link to existing local pages and assets', () => {
        for (const file of ['devices/pro/index.md', 'devices/history/PR2.md']) {
            for (const match of read(file).matchAll(/\]\((\/[^)]+)\)/g)) {
                const target = match[1].split('#')[0].split('?')[0]
                const candidates = [target + '.md', target + '/index.md', target + 'index.md', 'public' + target]
                expect(candidates.some(candidate => existsSync(path.join(root, candidate)))).toBe(true)
            }
        }
    })

    test('renders PR3 overview and optional-sensor labels on the server', async () => {
        const html = await renderToString(createSSRApp(Overview, { spec }))
        const text = plainText(html)
        expect(text).toContain('SKUPR3')
        expect(text).toContain('Version3')
        expect(text).toContain('Serial prefix52')
        expect(text).toContain('temperature (optional), pressure (optional), humidity (optional)')
        expect(html).toContain('/docs/pr/40/terminology/positioning/gnss')
        expect(text).not.toContain('PR2')
    })

    test.each(sectionNames)('renders the %s table from the same data passed to the PDF', async sectionName => {
        const html = await renderToString(createSSRApp(Section, { spec, sectionName }))
        expect(html).toContain('<table>')
        const text = plainText(html)
        const data = await pdfFor(spec, 'Pro (PR3)')
        const section = data.sections[sectionNames.indexOf(sectionName)]
        expect(section.subsections.length).toBeGreaterThan(0)
        for (const subsection of section.subsections) {
            expect(text).toContain(subsection.title)
            for (const row of subsection.rows) {
                expect(text).toContain(row.label)
                expect(text).toContain(plainText(String(row.value)))
            }
        }
    })

    test('exports PR3 identity, images and all sections without substituting PR2 or RH2 data', async () => {
        const data = await pdfFor(spec, 'Pro (PR3)')
        expect(data.title).toBe('Pro (PR3)')
        expect(data.mainTable).toMatchObject({ Name: 'Pro', Version: 3, SKU: 'PR3', 'Serial prefix': 52 })
        expect(data.sections).toHaveLength(9)
        expect(data.images).toEqual(spec.product.images.map((url: string) => `https://cors-proxy.lightbug.workers.dev?url=${encodeURIComponent(url)}`))
        const content = JSON.stringify(data.sections)
        expect(content).toContain('5-13.5')
        expect(content).toContain('RT9471')
        expect(content).toContain('requires compatible firmware')
        expect(content).toContain('not a finished-product accuracy specification')
        expect(content).not.toMatch(/BQ25890|SIM7000|UWB/)
    })

    test('retains PR2 identity in the specification used by the legacy page and download', async () => {
        const legacy = specForPage('devices/history/PR2.md')
        expect(legacy.product).toMatchObject({ name: 'ProN (PR2)', sku: 'PR2', prefix: 20, version: 2 })
        const title = read('devices/history/PR2.md').match(/\bdeviceTitle="([^"]+)"/)![1]
        const data = await pdfFor(legacy, title)
        expect(data.title).toBe('ProN (PR2)')
        expect(data.mainTable).toMatchObject({ Version: 2, SKU: 'PR2', 'Serial prefix': 20 })
    })
})
