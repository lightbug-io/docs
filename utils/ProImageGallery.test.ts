/** Component interaction checks using the repository's existing Vue compiler and jsdom. */
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { compileScript, parse } from '@vue/compiler-sfc'
import { createApp, createSSRApp, nextTick, type App, type Component } from 'vue'
import { renderToString } from '@vue/server-renderer'
const { load: parseYaml } = require('js-yaml')
import ts from 'typescript'

const read = (file: string) => readFileSync(path.join(__dirname, '..', file), 'utf8')
const source = read('components/ProImageGallery.vue')
const page = read('devices/pro/index.md')
const imageSources: string[] = parseYaml(read('public/device-specs/pro/v3.yaml')).product.images
const labels = ['Front angle', 'Top side', 'Back', 'Side']
const { descriptor } = parse(source, { filename: 'ProImageGallery.vue' })
const compiled = compileScript(descriptor, { id: 'pro-gallery-test', inlineTemplate: true })
const javascript = ts.transpileModule(compiled.content, {
    compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS, esModuleInterop: true },
}).outputText
const componentExports: { default?: Component } = {}
new Function('require', 'exports', javascript)(require, componentExports)
const ProImageGallery = componentExports.default!
const servedUrl = (index: number) => `https://cors-proxy.lightbug.workers.dev?url=${encodeURIComponent(imageSources[index])}`

let app: App | undefined
let host: HTMLDivElement
beforeEach(() => {
    host = document.createElement('div')
    document.body.appendChild(host)
})
afterEach(() => {
    app?.unmount()
    app = undefined
    host.remove()
    jest.restoreAllMocks()
})
async function mount() {
    app = createApp(ProImageGallery, { images: imageSources })
    app.mount(host)
    await nextTick()
}
const buttons = () => Array.from(host.querySelectorAll<HTMLButtonElement>('button'))
const mainImage = () => host.querySelector<HTMLImageElement>('.pro-gallery__image')!
async function press(index: number, key: string) {
    const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true })
    buttons()[index].dispatchEvent(event)
    await nextTick()
    return event
}

function expectSelection(index: number) {
    expect(mainImage().getAttribute('src')).toBe(servedUrl(index))
    expect(mainImage().classList.contains('pro-gallery__image--side')).toBe(labels[index] === 'Side')
    expect(mainImage().alt).toBe(`Shared Pro enclosure, ${labels[index].toLowerCase()} view`)
    expect(buttons().map(button => button.getAttribute('aria-pressed'))).toEqual(imageSources.map((_, i) => String(i === index)))
}

describe('Pro exterior gallery', () => {
    test('receives its image URLs from the current Pro3 page specification', async () => {
        expect(page).toContain("import spec from '../../public/device-specs/pro/v3.yaml?raw'")
        expect(page).toContain('<ProImageGallery :images="specs.product.images" />')
        expect(imageSources).toHaveLength(labels.length)
        const suppliedSources = imageSources.map((_, index) => `https://example.com/view-${index}.png`)
        app = createApp(ProImageGallery, { images: suppliedSources })
        app.mount(host)
        await nextTick()
        expect(buttons().map(button => button.querySelector('img')?.getAttribute('src'))).toEqual(
            suppliedSources.map(src => `https://cors-proxy.lightbug.workers.dev?url=${encodeURIComponent(src)}`),
        )
    })

    test('server rendering supplies a stable default image and labels before JavaScript loads', async () => {
        const html = await renderToString(createSSRApp(ProImageGallery, { images: imageSources }))
        const ssr = document.createElement('div')
        ssr.innerHTML = html
        expect(ssr.querySelector('.pro-gallery__image')?.getAttribute('src')).toBe(servedUrl(0))
        expect(ssr.querySelectorAll('button[disabled]')).toHaveLength(4)
        expect(ssr.querySelectorAll('button[aria-pressed="true"]')).toHaveLength(1)
        expect(html).toContain('Shared exterior views for Pro3 and ProN/PR2.')
        expect(html).toContain('Selecting another view requires JavaScript.')
    })

    test('hydrates the server-rendered gallery without mismatches and enables selection', async () => {
        host.innerHTML = await renderToString(createSSRApp(ProImageGallery, { images: imageSources }))
        const error = jest.spyOn(console, 'error').mockImplementation(() => {})
        const warn = jest.spyOn(console, 'warn').mockImplementation(() => {})
        app = createSSRApp(ProImageGallery, { images: imageSources })
        app.mount(host)
        await nextTick()
        expect(error).not.toHaveBeenCalled()
        expect(warn).not.toHaveBeenCalled()
        expect(buttons().every(button => !button.disabled)).toBe(true)
        buttons()[3].click()
        await nextTick()
        expectSelection(3)
    })

    test('renders four labelled native thumbnail buttons with one selected view', async () => {
        await mount()
        expect(host.querySelector('[role="group"]')?.getAttribute('aria-label')).toBe('Choose enclosure view')
        expect(buttons()).toHaveLength(4)
        buttons().forEach((button, index) => {
            expect(button.type).toBe('button')
            expect(button.disabled).toBe(false)
            expect(button.getAttribute('aria-label')).toBe(`Show ${labels[index].toLowerCase()} view`)
            expect(button.querySelector('img')?.getAttribute('src')).toBe(servedUrl(index))
            expect(button.querySelector('img')?.alt).toBe('')
            expect(button.querySelector('img')?.classList.contains('pro-gallery__image--side')).toBe(labels[index] === 'Side')
        })
        expectSelection(0)
    })

    test('every thumbnail selects its view and repeated clicks remain stable', async () => {
        await mount()
        for (const index of [1, 2, 3, 3, 0, 3, 1, 0, 0]) {
            buttons()[index].click()
            await nextTick()
            expectSelection(index)
        }
    })

    test('arrow keys wrap the views and move keyboard focus with the selection', async () => {
        await mount()
        const left = await press(0, 'ArrowLeft')
        expect(left.defaultPrevented).toBe(true)
        expectSelection(3)
        expect(document.activeElement).toBe(buttons()[3])
        await press(3, 'ArrowRight')
        expectSelection(0)
        expect(document.activeElement).toBe(buttons()[0])
        await press(0, 'ArrowRight')
        expectSelection(1)
        expect(document.activeElement).toBe(buttons()[1])
    })

    test('Home and End jump to first and last view without trapping Tab or other keys', async () => {
        await mount()
        await press(0, 'End')
        expectSelection(3)
        expect(document.activeElement).toBe(buttons()[3])
        await press(3, 'Home')
        expectSelection(0)
        expect(document.activeElement).toBe(buttons()[0])
        for (const key of ['Tab', 'Escape', 'ArrowDown']) {
            expect((await press(0, key)).defaultPrevented).toBe(false)
            expectSelection(0)
        }
    })

    test('image failure is readable and choosing another thumbnail recovers the stage', async () => {
        await mount()
        mainImage().dispatchEvent(new Event('error'))
        await nextTick()
        expect(host.querySelector('[role="status"]')?.textContent).toContain('This image could not load')
        expect(buttons()).toHaveLength(4)
        buttons()[2].click()
        await nextTick()
        expect(host.querySelector('[role="status"]')).toBeNull()
        expectSelection(2)
    })
})
