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
    Object.defineProperty(document, 'hidden', { configurable: true, value: false })
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
    jest.restoreAllMocks()
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

function setHidden(hidden: boolean) {
    Object.defineProperty(document, 'hidden', { configurable: true, value: hidden })
    document.dispatchEvent(new Event('visibilitychange'))
}

describe('compact power LED examples', () => {
    test.each(['battery', 'charging'])('%s removes the explanatory chrome and playback toolbar', async mode => {
        await mount(mode)
        expect(host.querySelector('.led-demo--power')).not.toBeNull()
        expect(host.querySelector('.led-demo__playback')).toBeNull()
        expect(host.querySelector('.led-demo__on-off')).toBeNull()
        expect(host.querySelector('.led-demo__frame')!.classList.contains('led-demo__sr-only')).toBe(true)
        for (const removed of ['INTERACTIVE EXAMPLE', 'Illustration only', 'Finished', 'Replay', 'Next frame', 'Play animation', 'Starts paused']) {
            expect(host.textContent).not.toContain(removed)
        }
        expect(host.querySelector('input[type="range"]')).not.toBeNull()
        expect(host.querySelector('.led-demo__presets')).not.toBeNull()
    })

    test('orange styling is scoped to power LEDs, not the vehicle or RH2', async () => {
        expect(source).toContain('.led-demo--power .led-demo__light--on { border-color: #b85b05; background: #f59a23;')
        await mount('vehicle')
        expect(host.querySelector('.led-demo--power')).toBeNull()
        app!.unmount()
        await mount('rh2')
        expect(host.querySelector('.led-demo--power')).toBeNull()
        expect(host.querySelector('.led-demo__rgb')).not.toBeNull()
    })

    test('normal battery levels stay steady without a timer or motion control', async () => {
        await mount('battery')
        expect(currentFrame()).toBe('On: 1, 2')
        expect(jest.getTimerCount()).toBe(0)
        expect(host.querySelector('.led-demo__pause')).toBeNull()
        await advance(10000)
        expect(currentFrame()).toBe('On: 1, 2')
    })

    test('selecting low battery starts six flashes automatically, then stops off', async () => {
        await mount('battery')
        await click('10%')
        expect(jest.getTimerCount()).toBe(1)
        expect(currentFrame()).toBe('On: 1')
        expect(host.textContent).not.toContain('flash 1 of 6')
        await advance(299)
        expect(currentFrame()).toBe('On: 1')
        await advance(1)
        expect(currentFrame()).toBe('All indicators off')
        await advance(299)
        expect(currentFrame()).toBe('All indicators off')
        await advance(1)
        expect(currentFrame()).toBe('On: 1')
        await advance(2700)
        expect(currentFrame()).toBe('All indicators off')
        await advance(300)
        expect(currentFrame()).toBe('All indicators off')
        expect(jest.getTimerCount()).toBe(0)
        expect(host.textContent).not.toContain('Finished')
    })

    test('selecting the same preset restarts the finite sequence without replay controls', async () => {
        await mount('battery')
        await click('10%')
        await advance(3600)
        expect(jest.getTimerCount()).toBe(0)
        await click('10%')
        expect(currentFrame()).toBe('On: 1')
        expect(jest.getTimerCount()).toBe(1)
        await advance(300)
        expect(currentFrame()).toBe('All indicators off')
        await click('10%')
        expect(currentFrame()).toBe('On: 1')
        expect(jest.getTimerCount()).toBe(1)
        await advance(300)
        expect(currentFrame()).toBe('All indicators off')
    })

    test('charging starts automatically and uses exact one-second phases', async () => {
        await mount()
        expect(currentFrame()).toBe('On: 1, 2')
        expect(jest.getTimerCount()).toBe(1)
        expect(host.textContent).not.toMatch(/Pause|Resume/)
        expect(host.querySelector('.led-demo__playback')).toBeNull()
        await advance(999)
        expect(currentFrame()).toBe('On: 1, 2')
        await advance(1)
        expect(currentFrame()).toBe('On: 1')
        await advance(999)
        expect(currentFrame()).toBe('On: 1')
        await advance(1)
        expect(currentFrame()).toBe('On: 1, 2')
    })

    test('power demos have no pause or resume buttons and a bounded width', async () => {
        await mount()
        expect(host.textContent).not.toMatch(/Pause|Resume/)
        expect(source).toContain('max-width: 28rem')
        await click('95%')
        expect(jest.getTimerCount()).toBe(0)
        await click('55%')
        expect(jest.getTimerCount()).toBe(1)
    })

    test('selection changes start the appropriate pattern and remove motion controls for a steady level', async () => {
        await mount()
        await advance(1500)
        await click('95%')
        expect(currentFrame()).toBe('On: 1, 2, 3, 4')
        expect(host.querySelector('.led-demo__pause')).toBeNull()
        expect(jest.getTimerCount()).toBe(0)
        await click('90%')
        expect(jest.getTimerCount()).toBe(1)
        await advance(1000)
        expect(currentFrame()).toBe('On: 1, 2, 3')
        await click('35%')
        expect(jest.getTimerCount()).toBe(1)
        expect(currentFrame()).toBe('On: 1')
    })

    test('the native range input automatically selects the matching battery pattern', async () => {
        await mount('battery')
        const range = host.querySelector('input[type="range"]') as HTMLInputElement
        range.value = '10'
        range.dispatchEvent(new Event('input', { bubbles: true }))
        await nextTick()
        expect(jest.getTimerCount()).toBe(1)
        await advance(300)
        expect(currentFrame()).toBe('All indicators off')
        range.value = '20'
        range.dispatchEvent(new Event('input', { bubbles: true }))
        await nextTick()
        expect(currentFrame()).toBe('On: 1')
        expect(jest.getTimerCount()).toBe(0)
        expect(host.querySelector('.led-demo__summary')!.textContent).toBe('1 of 4 LEDs on.')
    })

    test.each(['battery', 'charging'])('%s respects reduced motion with a representative static on frame', async mode => {
        motion = true
        await mount(mode)
        await click('10%')
        expect(currentFrame()).toBe('On: 1')
        expect(host.textContent).toContain('Animation off for reduced motion.')
        expect(host.querySelector('.led-demo__pause')).toBeNull()
        expect(jest.getTimerCount()).toBe(0)
        await advance(10000)
        expect(currentFrame()).toBe('On: 1')
        await click('10%')
        expect(jest.getTimerCount()).toBe(0)
    })

    test('dynamic reduced motion stops playback and shows the representative frame, without auto-resuming', async () => {
        await mount()
        await advance(1500)
        expect(currentFrame()).toBe('On: 1')
        motionChange?.({ matches: true })
        await nextTick()
        expect(currentFrame()).toBe('On: 1, 2')
        expect(jest.getTimerCount()).toBe(0)
        motionChange?.({ matches: false })
        await nextTick()
        expect(jest.getTimerCount()).toBe(0)
        await click('55%')
        expect(jest.getTimerCount()).toBe(1)
    })

    test('hidden tabs pause playback and visible tabs resume the automatic pattern', async () => {
        await mount()
        await advance(1750)
        setHidden(true)
        await nextTick()
        expect(jest.getTimerCount()).toBe(0)
        await advance(5000)
        expect(currentFrame()).toBe('On: 1')
        setHidden(false)
        await nextTick()
        expect(jest.getTimerCount()).toBe(1)
        await advance(250)
        expect(currentFrame()).toBe('On: 1, 2')
    })

    test('mounting or selecting while hidden never schedules animation', async () => {
        setHidden(true)
        await mount()
        expect(jest.getTimerCount()).toBe(0)
        await click('10%')
        expect(jest.getTimerCount()).toBe(0)
    })

    test('automatic frames stay silent for screen readers while the stable behavior summary is available', async () => {
        await mount()
        expect(host.querySelector('.led-demo__frame')!.getAttribute('aria-live')).toBe('off')
        expect(host.querySelector('.led-demo__summary')!.getAttribute('aria-live')).toBe('polite')
        expect(host.querySelector('.led-demo__summary')!.textContent).toBe('The highest lit LED blinks while charging.')
        await advance(1000)
        expect(host.querySelector('.led-demo__summary')!.textContent).toBe('The highest lit LED blinks while charging.')
    })
})

describe('SSR and playback cleanup', () => {
    test.each(['battery', 'charging', 'rh2', 'vehicle'])('%s server rendering stays readable, disabled and free of timers', async mode => {
        const html = await renderToString(createSSRApp(LedDemo, { mode }))
        expect(html).toContain('led-demo__summary')
        expect(html).toContain('Enable JavaScript to adjust this example.')
        expect(html).toContain('disabled')
        expect(html).not.toContain('INTERACTIVE EXAMPLE')
        expect(html).not.toContain('Illustration only')
        expect(jest.getTimerCount()).toBe(0)
    })

    test.each(['battery', 'charging', 'rh2', 'vehicle'])('%s hydrates without mismatches and enables its controls', async mode => {
        host.innerHTML = await renderToString(createSSRApp(LedDemo, { mode }))
        const error = jest.spyOn(console, 'error').mockImplementation(() => {})
        const warn = jest.spyOn(console, 'warn').mockImplementation(() => {})
        app = createSSRApp(LedDemo, { mode })
        app.mount(host)
        await nextTick()
        expect(error).not.toHaveBeenCalled()
        expect(warn).not.toHaveBeenCalled()
        expect(host.textContent).not.toContain('Enable JavaScript')
        expect((host.querySelector('input') as HTMLInputElement).disabled).toBe(false)
        expect(jest.getTimerCount()).toBe(mode === 'charging' ? 1 : 0)
    })

    test('unmount removes automatic playback and both listeners', async () => {
        const removeVisibilityListener = jest.spyOn(document, 'removeEventListener')
        await mount()
        expect(jest.getTimerCount()).toBe(1)
        app!.unmount()
        app = undefined
        expect(jest.getTimerCount()).toBe(0)
        expect(removeMotionListener).toHaveBeenCalledWith('change', motionChange)
        expect(removeVisibilityListener).toHaveBeenCalledWith('visibilitychange', expect.any(Function))
    })
})

describe('other LED models retain manual playback', () => {
    test.each(['rh2', 'vehicle'])('%s remains paused until requested', async mode => {
        await mount(mode)
        expect(jest.getTimerCount()).toBe(0)
        const initial = currentFrame()
        await advance(10000)
        expect(currentFrame()).toBe(initial)
        await click('Play animation')
        expect(jest.getTimerCount()).toBe(1)
    })

    test('RH2 manual frames are announced while playing frames remain silent', async () => {
        await mount('rh2')
        expect(host.querySelector('.led-demo__frame')!.getAttribute('aria-live')).toBe('polite')
        await click('Play animation')
        expect(host.querySelector('.led-demo__frame')!.getAttribute('aria-live')).toBe('off')
        await click('Next frame')
        expect(host.querySelector('.led-demo__frame')!.getAttribute('aria-live')).toBe('polite')
        expect(currentFrame()).toContain('step 2 of 5')
        expect(jest.getTimerCount()).toBe(0)
    })

    test('RH2 still supports reduced-motion manual stepping', async () => {
        motion = true
        await mount('rh2')
        expect(button('Play animation').disabled).toBe(true)
        await click('Next frame')
        expect(currentFrame()).toContain('step 2 of 5')
        await click('Reset')
        expect(currentFrame()).toContain('step 1 of 5')
        expect(jest.getTimerCount()).toBe(0)
    })

    test('vehicle conditions and replay remain model-specific and stop after five cycles', async () => {
        await mount('vehicle')
        expect(host.querySelector('input[type="range"]')).toBeNull()
        const checkboxes = host.querySelectorAll<HTMLInputElement>('input[type="checkbox"]')
        checkboxes[0].click()
        await nextTick()
        expect(currentFrame()).toBe('On: 3, 4 · cycle 1 of 5')
        await click('Play animation')
        await advance(2500)
        expect(currentFrame()).toBe('All indicators off · sequence complete')
        expect(host.textContent).not.toContain('Finished')
        expect(jest.getTimerCount()).toBe(0)
        await click('Replay')
        expect(currentFrame()).toBe('On: 3, 4 · cycle 1 of 5')
        checkboxes[1].click()
        await nextTick()
        expect(currentFrame()).toBe('All indicators off')
        expect(button('Play animation').disabled).toBe(true)
    })
})
