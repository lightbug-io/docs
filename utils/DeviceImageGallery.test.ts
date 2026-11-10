/** Component interaction checks using the repository's existing Vue compiler and jsdom. */
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { compileScript, compileTemplate, parse } from '@vue/compiler-sfc'
import { createApp, createSSRApp, computed, h, nextTick, ref, type App, type Component } from 'vue'
import { renderToString } from '@vue/server-renderer'
const { load: parseYaml } = require('js-yaml')
import ts from 'typescript'

const read = (file: string) => readFileSync(path.join(__dirname, '..', file), 'utf8')
const source = read('components/DeviceImageGallery.vue')
const page = read('devices/pro/index.md')
const imageSources: string[] = parseYaml(read('public/device-specs/pro/v3.yaml')).product.images
const galleryConfig = page.slice(page.indexOf('const viewLabels'), page.indexOf('</script>'))
const loadSpec = evaluate(ts.transpileModule(read('utils/loadSpec.js'), { compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true } }).outputText).default
const proSpec = loadSpec(read('public/device-specs/pro/v3.yaml'))
const proImages = new Function('specs', 'computed', galleryConfig + '\nreturn galleryImages')(proSpec, computed).value
const labels: string[] = proImages.map((image: any) => image.label)
const proProps = {
    images: proImages,
    ariaLabel: 'Pro enclosure gallery',
    caption: 'Shared exterior views for Pro3 and ProN/PR2.',
}
const { descriptor } = parse(source, { filename: 'DeviceImageGallery.vue' })
const compiled = compileScript(descriptor, { id: 'device-gallery-test', inlineTemplate: true })
const javascript = ts.transpileModule(compiled.content, {
    compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS, esModuleInterop: true },
}).outputText
const componentExports: { default?: Component } = {}
function evaluate(javascript: string) {
    const exports: Record<string, any> = {}
    const resolve = (name: string): any => {
        if (name === 'vitepress') return { withBase: (url: string) => /^(?:[a-z]+:)?\/\//i.test(url) ? url : `/docs/pr/40/${url.replace(/^\//, '')}` }
        if (name.endsWith('/DeviceImageUrl')) return evaluate(ts.transpileModule(read('utils/DeviceImageUrl.ts'), {
            compilerOptions: { module: ts.ModuleKind.CommonJS },
        }).outputText)
        return require(name)
    }
    new Function('require', 'exports', javascript)(resolve, exports)
    return exports
}
Object.assign(componentExports, evaluate(javascript))
const DeviceImageGallery = componentExports.default!
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
async function mount(props: Record<string, any> = proProps) {
    app = createApp(DeviceImageGallery, props)
    app.mount(host)
    await nextTick()
}
const buttons = () => Array.from(host.querySelectorAll<HTMLButtonElement>('button'))
const mainImage = () => host.querySelector<HTMLImageElement>('.device-gallery__image')!
async function press(index: number, key: string) {
    const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true })
    buttons()[index].dispatchEvent(event)
    await nextTick()
    return event
}

function expectSelection(index: number) {
    expect(mainImage().getAttribute('src')).toBe(servedUrl(index))
    expect(mainImage().style.transform).toBe(`translateY(${proImages[index].offsetY}%) scale(1.25)`)
    expect(mainImage().alt).toBe(`Shared Pro enclosure, ${labels[index].toLowerCase()} view`)
    expect(buttons().map(button => button.getAttribute('aria-pressed'))).toEqual(imageSources.map((_, i) => String(i === index)))
}

describe('Reusable device image gallery', () => {
    test('uses YAML-backed Pro metadata without putting product assumptions in the component', async () => {
        expect(page).toContain("import spec from '../../public/device-specs/pro/v3.yaml?raw'")
        expect(page).toContain(':images="galleryImages"')
        expect(proImages.map((image: any) => image.src)).toEqual(imageSources)
        expect(labels).toEqual(['Front angle', 'Top side', 'Back', 'Side'])
        await mount()
        expect(host.querySelector('figure')?.getAttribute('aria-label')).toBe(proProps.ariaLabel)
        expect(host.querySelector('figcaption')?.textContent).toBe(proProps.caption)
        expectSelection(0)
    })

    test('server rendering supplies a stable default image and labels before JavaScript loads', async () => {
        const html = await renderToString(createSSRApp(DeviceImageGallery, proProps))
        const ssr = document.createElement('div')
        ssr.innerHTML = html
        expect(ssr.querySelector('.device-gallery__image')?.getAttribute('src')).toBe(servedUrl(0))
        expect(ssr.querySelectorAll('button[disabled]')).toHaveLength(4)
        expect(ssr.querySelectorAll('button[aria-pressed="true"]')).toHaveLength(1)
        expect(html).toContain('Shared exterior views for Pro3 and ProN/PR2.')
        expect(html).toContain('Selecting another view requires JavaScript.')
    })

    test('hydrates the server-rendered gallery without mismatches and enables selection', async () => {
        host.innerHTML = await renderToString(createSSRApp(DeviceImageGallery, proProps))
        const error = jest.spyOn(console, 'error').mockImplementation(() => {})
        const warn = jest.spyOn(console, 'warn').mockImplementation(() => {})
        app = createSSRApp(DeviceImageGallery, proProps)
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
        expect(host.querySelector('[role="group"]')?.getAttribute('aria-label')).toBe('Choose image')
        expect(buttons()).toHaveLength(4)
        buttons().forEach((button, index) => {
            expect(button.type).toBe('button')
            expect(button.disabled).toBe(false)
            expect(button.getAttribute('aria-label')).toBe(`Show ${labels[index]}`)
            expect(button.querySelector('img')?.getAttribute('src')).toBe(servedUrl(index))
            expect(button.querySelector('img')?.alt).toBe('')
            expect(button.querySelector('img')?.style.transform).toBe(`translateY(${proImages[index].offsetY}%) scale(1.25)`)
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

    test('supports a non-Pro collection with neutral framing and local, proxied and external URLs', async () => {
        const sources = ['/images/a.png', 'images/b.png', 'https://lightbug.io/c.png', 'https://example.com/d.png', 'https://lightbug.cloud/e.png']
        await mount({ images: sources })
        expect(buttons()).toHaveLength(5)
        expect(buttons().map(button => button.textContent)).toEqual(sources.map((_, i) => `Image ${i + 1}`))
        expect(buttons().map(button => button.querySelector('img')?.getAttribute('src'))).toEqual([
            '/docs/pr/40/images/a.png', '/docs/pr/40/images/b.png',
            `https://cors-proxy.lightbug.workers.dev?url=${encodeURIComponent(sources[2])}`,
            sources[3], `https://cors-proxy.lightbug.workers.dev?url=${encodeURIComponent(sources[4])}`,
        ])
        expect(mainImage().alt).toBe('Image 1')
        expect(mainImage().style.objectFit).toBe('contain')
        expect(mainImage().style.transform).toBe('translateY(0%) scale(1)')
        expect(host.textContent).not.toMatch(/Pro|enclosure/)
        expect(host.querySelector('figcaption')).toBeNull()
        await press(0, 'End')
        expect(mainImage().alt).toBe('Image 5')
        await press(4, 'ArrowRight')
        expect(mainImage().alt).toBe('Image 1')
    })

    test('renders empty and single-image collections without unusable navigation', async () => {
        expect(await renderToString(createSSRApp(DeviceImageGallery, { images: [] }))).not.toContain('<figure')
        await mount({ images: [{ src: '/single.png', alt: '', label: 'Sensor' }], caption: 'Sensor detail', aspectRatio: '1 / 1' })
        expect(mainImage().alt).toBe('')
        expect(buttons()).toHaveLength(0)
        expect(host.querySelector('noscript')).toBeNull()
        expect(host.querySelector('figcaption')?.textContent).toBe('Sensor detail')
        expect(host.querySelector('figure')?.style.getPropertyValue('--gallery-aspect-ratio')).toBe('1 / 1')
    })

    test('recovers selection and image errors when the supplied collection changes', async () => {
        const supplied = ref<any[]>(proImages)
        app = createApp({ render: () => h(DeviceImageGallery, { images: supplied.value }) })
        app.mount(host)
        await nextTick()
        await press(0, 'End')
        mainImage().dispatchEvent(new Event('error'))
        await nextTick()
        supplied.value = [{ src: '/replacement.png', alt: 'Replacement sensor' }]
        await nextTick()
        expect(host.querySelector('[role="status"]')).toBeNull()
        expect(mainImage().alt).toBe('Replacement sensor')
        supplied.value = []
        await nextTick()
        expect(host.querySelector('figure')).toBeNull()
        supplied.value.push({ src: '/next.png' })
        await nextTick()
        expect(mainImage().getAttribute('src')).toBe('/docs/pr/40/next.png')
    })

    test('multiple galleries and repeated URLs have independent selection without duplicate IDs', async () => {
        const warn = jest.spyOn(console, 'warn').mockImplementation(() => {})
        app = createApp({ render: () => h('div', [
            h(DeviceImageGallery, { images: ['/a.png', '/a.png'] }),
            h(DeviceImageGallery, { images: ['/b.png', '/c.png'] }),
        ]) })
        app.mount(host)
        await nextTick()
        buttons()[1].click()
        await nextTick()
        expect(buttons().map(button => button.getAttribute('aria-pressed'))).toEqual(['false', 'true', 'true', 'false'])
        expect(host.querySelectorAll('[id]')).toHaveLength(0)
        expect(warn).not.toHaveBeenCalled()
    })

    test('overview layout preserves arbitrary content, media, headings and anchors without device logic', async () => {
        const { descriptor } = parse(read('components/DeviceOverview.vue'))
        const compiled = compileTemplate({ source: descriptor.template!.content, filename: 'DeviceOverview.vue', id: 'overview-test' })
        const render = evaluate(ts.transpileModule(compiled.code, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText).render
        const Overview = { render }
        const html = await renderToString(createSSRApp({ render: () => h(Overview, { id: 'existing-anchor' }, {
            default: () => h('h2', 'Sensor guides'), media: () => h('img', { src: '/sensor.png', alt: 'Sensor' }),
        }) }))
        expect(html).toContain('id="existing-anchor"')
        expect(html).toContain('<h2>Sensor guides</h2>')
        expect(html).toContain('alt="Sensor"')
        const textOnly = await renderToString(createSSRApp({ render: () => h(Overview, null, () => 'Text only') }))
        expect(textOnly).toContain('Text only')
        expect(textOnly).not.toContain('device-overview__media')
    })
})
