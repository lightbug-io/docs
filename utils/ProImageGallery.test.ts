/** Component interaction checks using the repository's existing Vue compiler and jsdom. */
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { compileScript, compileStyle, parse } from '@vue/compiler-sfc'
import { createApp, createSSRApp, nextTick, type App, type Component } from 'vue'
import { renderToString } from '@vue/server-renderer'
const { load: parseYaml } = require('js-yaml')
import ts from 'typescript'
import images from '../data/pro-exterior-images.json'

const read = (file: string) => readFileSync(path.join(__dirname, '..', file), 'utf8')
const source = read('components/ProImageGallery.vue')
const page = read('devices/pro/index.md')
const { descriptor } = parse(source, { filename: 'ProImageGallery.vue' })
const compiled = compileScript(descriptor, { id: 'pro-gallery-test', inlineTemplate: true })
const javascript = ts.transpileModule(compiled.content, {
    compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS, esModuleInterop: true },
}).outputText
const componentExports: { default?: Component } = {}
new Function('require', 'exports', javascript)(require, componentExports)
const ProImageGallery = componentExports.default!
const servedUrl = (index: number) => `https://cors-proxy.lightbug.workers.dev?url=${encodeURIComponent(images[index].src)}`

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
    app = createApp(ProImageGallery)
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
    expect(mainImage().alt).toBe(`Shared Pro enclosure, ${images[index].label.toLowerCase()} view`)
    expect(buttons().map(button => button.getAttribute('aria-pressed'))).toEqual(images.map((_, i) => String(i === index)))
}

describe('Pro exterior gallery', () => {
    test('reuses exactly the four existing exterior URLs without bringing legacy specifications into PR3', () => {
        const legacy = parseYaml(read('public/device-specs/pro/v2.yaml'))
        expect(images).toHaveLength(4)
        expect(new Set(images.map(image => image.src)).size).toBe(4)
        expect(images.map(image => image.src)).toEqual(legacy.product.images)
        expect(images.map(image => image.label)).toEqual(['Front angle', 'Top side', 'Back', 'Side'])
        images.forEach(image => expect(Object.keys(image).sort()).toEqual(['label', 'src']))
        expect(source).not.toMatch(/loadSpec|useDeviceSpec|device-specs\/pro\/v2/)
        expect(page).toContain('<ProImageGallery />')
        expect(page).not.toContain('![Pro3 tracker enclosure]')
        expect(page).toContain('## Feature guides {#capabilities}')
        expect(page).toContain('## Earlier Pro generations {#pro-pr2}')
    })

    test('server rendering supplies a stable default image and labels before JavaScript loads', async () => {
        const html = await renderToString(createSSRApp(ProImageGallery))
        const ssr = document.createElement('div')
        ssr.innerHTML = html
        expect(ssr.querySelector('.pro-gallery__image')?.getAttribute('src')).toBe(servedUrl(0))
        expect(ssr.querySelectorAll('button[disabled]')).toHaveLength(4)
        expect(ssr.querySelectorAll('button[aria-pressed="true"]')).toHaveLength(1)
        expect(ssr.querySelectorAll('img[width="1920"][height="1080"]')).toHaveLength(5)
        expect(html).toContain('Shared exterior views for Pro3 and ProN/PR2.')
        expect(html).toContain('Selecting another view requires JavaScript.')
    })

    test('hydrates the server-rendered gallery without mismatches and enables selection', async () => {
        host.innerHTML = await renderToString(createSSRApp(ProImageGallery))
        const error = jest.spyOn(console, 'error').mockImplementation(() => {})
        const warn = jest.spyOn(console, 'warn').mockImplementation(() => {})
        app = createSSRApp(ProImageGallery)
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
            expect(button.getAttribute('aria-label')).toBe(`Show ${images[index].label.toLowerCase()} view`)
            expect(button.querySelector('img')?.getAttribute('src')).toBe(servedUrl(index))
            expect(button.querySelector('img')?.alt).toBe('')
        })
        expectSelection(0)
    })

    test('every thumbnail selects its view and repeated clicks remain stable', async () => {
        await mount()
        for (const index of [1, 2, 3, 0, 0]) {
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

    test('reserves image space, reframes white margins and includes visible selection/focus styles', () => {
        const css = descriptor.styles[0].content
        const result = compileStyle({ source: css, filename: 'ProImageGallery.vue', id: 'pro-gallery-test', scoped: true })
        expect(result.errors).toEqual([])
        expect(css).toMatch(/\.pro-gallery__stage\s*\{[^}]*aspect-ratio:\s*4\s*\/\s*3/)
        expect(css).toMatch(/\.pro-gallery__stage\s*\{[^}]*overflow:\s*hidden/)
        expect(css).toContain('object-fit: cover')
        expect(css).toContain('transform: scale(1.25)')
        expect(css).toContain('grid-template-columns: repeat(4, minmax(0, 1fr))')
        expect(css).toContain('min-height: 44px')
        expect(css).toMatch(/\[aria-pressed="true"\]\s*\{[^}]*border-color:/)
        expect(css).toMatch(/:focus-visible\s*\{[^}]*outline:/)
        expect(css).not.toMatch(/transition:|animation:/)
    })

    test('stacks at small article widths and places the compact gallery at the right when space allows', () => {
        const css = page.match(/<style scoped>([\s\S]*?)<\/style>/)?.[1]
        expect(css).toBeDefined()
        const result = compileStyle({ source: css!, filename: 'Pro.md', id: 'pro-page-test', scoped: true })
        expect(result.errors).toEqual([])
        expect(css).toContain('container-type: inline-size')
        expect(css).toMatch(/\.pro-overview__layout\s*\{[^}]*grid-template-columns:\s*minmax\(0, 1fr\)/)
        expect(css).toContain('@container (min-width: 42rem)')
        expect(css).toContain('grid-template-columns: minmax(0, 1fr) 18rem')
        expect(css).toContain('justify-self: end')
        expect(source).toContain('max-width: 20rem')
    })
})
