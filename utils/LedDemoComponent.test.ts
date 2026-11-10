/** Component interaction checks using the repository's existing Vue compiler and jsdom. */
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { compileScript, parse } from '@vue/compiler-sfc'
import { createApp, createSSRApp, nextTick, type App, type Component } from 'vue'
import { renderToString } from '@vue/server-renderer'
import ts from 'typescript'

const source = readFileSync(path.join(__dirname, '../components/LedDemo.vue'), 'utf8')
const { descriptor } = parse(source, { filename: 'LedDemo.vue' })
const compiled = compileScript(descriptor, { id: 'led-demo-test', inlineTemplate: true })
const javascript = ts.transpileModule(compiled.content, {
    compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS },
}).outputText
const componentExports: { default?: Component } = {}
// Load the actual compiled SFC, with only imports resolved by Jest.
new Function('require', 'exports', javascript)(require, componentExports)
const LedDemo = componentExports.default!

let app: App | undefined
let host: HTMLDivElement
let motionChange: ((event: { matches: boolean }) => void) | undefined
let motion: boolean
let addMotionListener: jest.Mock
let removeMotionListener: jest.Mock

beforeEach(() => {
    jest.useFakeTimers()
    motion = false
    motionChange = undefined
    addMotionListener = jest.fn((_event, callback) => { motionChange = callback })
    removeMotionListener = jest.fn()
    Object.defineProperty(window, 'matchMedia', {
        configurable: true,
        value: jest.fn(() => ({ matches: motion, addEventListener: addMotionListener, removeEventListener: removeMotionListener })),
    })
    host = document.createElement('div')
    document.body.appendChild(host)
})
afterEach(() => {
    app?.unmount()
    app = undefined
    host.remove()
    jest.useRealTimers()
})
async function mount(mode = 'charging') {
    app = createApp(LedDemo, { mode })
    app.mount(host)
    await nextTick()
}
function button(label: string) {
    const found = Array.from(host.querySelectorAll('button')).find(element => element.textContent?.trim().replace(/\s+/g, ' ').includes(label))
    if (!found) throw new Error(`Missing button: ${label}`)
    return found
}
async function click(label: string) {
    button(label).click()
    await nextTick()
}
function currentFrame() { return host.querySelector('.led-demo__frame')!.textContent }
async function advance(ms: number) {
    jest.advanceTimersByTime(ms)
    await nextTick()
}

describe('interactive LED component', () => {
    test('server rendering retains a readable default without starting playback', async () => {
        const html = await renderToString(createSSRApp(LedDemo, { mode: 'charging' }))
        expect(html).toContain('On: 1, 2')
        expect(html).toContain('Indicator 2 blinks: 1 second on, 1 second off.')
        expect(html).toContain('Interactive controls need JavaScript')
        expect(html).toContain('disabled')
        expect(jest.getTimerCount()).toBe(0)
    })

    test('manual frames are announced while playing frames stay silent', async () => {
        await mount()
        expect(host.querySelector('.led-demo__frame')!.getAttribute('aria-live')).toBe('polite')
        await click('Play animation')
        expect(host.querySelector('.led-demo__frame')!.getAttribute('aria-live')).toBe('off')
        await click('Next frame')
        expect(host.querySelector('.led-demo__frame')!.getAttribute('aria-live')).toBe('polite')
        expect(currentFrame()).toBe('On: 1')
        expect(jest.getTimerCount()).toBe(0)
    })

    test('a range input updates the level and vehicle inputs stay model-specific', async () => {
        await mount('battery')
        const range = host.querySelector('input[type="range"]') as HTMLInputElement
        range.value = '20'
        range.dispatchEvent(new Event('input', { bubbles: true }))
        await nextTick()
        expect(currentFrame()).toBe('On: 1')
        expect(host.textContent).toContain('20%')
        expect(host.querySelectorAll('input[type="checkbox"]')).toHaveLength(0)
        app!.unmount()
        await mount('vehicle')
        expect(host.querySelector('input[type="range"]')).toBeNull()
        const checkboxes = host.querySelectorAll<HTMLInputElement>('input[type="checkbox"]')
        checkboxes[0].click()
        await nextTick()
        expect(currentFrame()).toBe('On: 3, 4 · cycle 1 of 5')
        checkboxes[1].click()
        await nextTick()
        expect(currentFrame()).toBe('All indicators off')
        expect(button('Play animation').disabled).toBe(true)
    })

    test.each(['battery', 'charging', 'rh2', 'vehicle'])('%s starts with a readable static frame and no timer', async mode => {
        await mount(mode)
        expect(currentFrame()).toBeTruthy()
        expect(host.querySelector('.led-demo__summary')!.textContent).toBeTruthy()
        expect(host.textContent).toContain('not live device data')
        expect(jest.getTimerCount()).toBe(0)
        const initial = currentFrame()
        await advance(10000)
        expect(currentFrame()).toBe(initial)
    })

    test('play, pause and resume keep the currently shown charging frame', async () => {
        await mount()
        expect(currentFrame()).toBe('On: 1, 2')
        await click('Play animation')
        await advance(1750)
        expect(currentFrame()).toBe('On: 1')
        await click('Pause')
        expect(jest.getTimerCount()).toBe(0)
        await advance(5000)
        expect(currentFrame()).toBe('On: 1')
        await click('Play animation')
        await advance(249)
        expect(currentFrame()).toBe('On: 1')
        await advance(1)
        expect(currentFrame()).toBe('On: 1, 2')
    })

    test('next frame pauses animation and replay restarts the sequence', async () => {
        await mount()
        await click('Next frame')
        expect(currentFrame()).toBe('On: 1')
        expect(jest.getTimerCount()).toBe(0)
        await click('Replay')
        expect(currentFrame()).toBe('On: 1, 2')
        expect(jest.getTimerCount()).toBe(1)
    })

    test('changing a battery preset resets and pauses before showing the new value', async () => {
        await mount()
        await click('Play animation')
        await advance(1500)
        await click('95%')
        expect(currentFrame()).toBe('On: 1, 2, 3, 4')
        expect(host.textContent).toContain('Steady display')
        expect(button('Play animation').disabled).toBe(true)
        expect(jest.getTimerCount()).toBe(0)
    })

    test('reduced motion uses manual stepping, including replay/reset', async () => {
        motion = true
        await mount('rh2')
        expect(button('Play animation').disabled).toBe(true)
        expect(host.textContent).toContain('Reduced motion is on')
        await click('Next frame')
        expect(currentFrame()).toContain('step 2 of 5')
        await click('Reset')
        expect(currentFrame()).toContain('step 1 of 5')
        expect(jest.getTimerCount()).toBe(0)
    })

    test('a dynamic reduced-motion preference pauses immediately and never auto-resumes', async () => {
        await mount()
        await click('Play animation')
        await advance(1500)
        motionChange?.({ matches: true })
        await nextTick()
        expect(currentFrame()).toBe('On: 1')
        expect(jest.getTimerCount()).toBe(0)
        expect(button('Play animation').disabled).toBe(true)
        motionChange?.({ matches: false })
        await nextTick()
        expect(button('Play animation').disabled).toBe(false)
        expect(jest.getTimerCount()).toBe(0)
    })

    test('vehicle replay stops after five cycles and leaves all lights off', async () => {
        await mount('vehicle')
        await click('Play animation')
        await advance(2500)
        expect(currentFrame()).toBe('All indicators off · sequence complete')
        expect(host.textContent).toContain('Finished')
        expect(jest.getTimerCount()).toBe(0)
        await click('Replay')
        expect(currentFrame()).toBe('On: 1, 2, 3, 4 · cycle 1 of 5')
    })

    test('unmount removes the timer and preference listener', async () => {
        await mount()
        await click('Play animation')
        app!.unmount()
        app = undefined
        expect(jest.getTimerCount()).toBe(0)
        expect(removeMotionListener).toHaveBeenCalledWith('change', motionChange)
    })
})
