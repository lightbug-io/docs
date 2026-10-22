import { installMessageRouteCorrection, messageAnchorScrollTop } from './MessageAnchor'

describe('message anchor clearance', () => {
    const element = (top: number, height = 0) => {
        const node = document.createElement('section')
        node.getBoundingClientRect = () => ({ top, height } as DOMRect)
        document.body.append(node)
        return node
    }
    beforeEach(() => {
        document.body.replaceChildren()
        Object.defineProperty(window, 'scrollY', { configurable: true, value: 1000 })
    })
    it('places the operation badge below the desktop header and sticky jump bar', () => {
        const target = element(500)
        target.style.paddingTop = '28px'
        target.style.borderTop = '3px solid black'
        const bar = element(64, 80)
        bar.style.top = '64px'
        expect(messageAnchorScrollTop(target, bar)).toBe(1371)
    })
    it('uses the measured wrapped bar and mobile local-navigation offset', () => {
        const target = element(500)
        const bar = element(48, 144)
        bar.style.top = '48px'
        expect(messageAnchorScrollTop(target, bar)).toBe(1292)
    })
    it('recomputes after another scroll instead of reusing stale page coordinates', () => {
        const target = element(200)
        const bar = element(64, 80)
        bar.style.top = '64px'
        expect(messageAnchorScrollTop(target, bar)).toBe(1040)
        Object.defineProperty(window, 'scrollY', { configurable: true, value: 1100 })
        target.getBoundingClientRect = () => ({ top: 100 } as DOMRect)
        expect(messageAnchorScrollTop(target, bar)).toBe(1040)
    })
    it('keeps a near-top anchor within document bounds', () => {
        Object.defineProperty(window, 'scrollY', { configurable: true, value: 0 })
        expect(messageAnchorScrollTop(element(20), element(64, 80))).toBe(0)
    })
})

describe('message route completion correction', () => {
    it('corrects after every completed history navigation, not just the initial mount', async () => {
        const order: string[] = []
        const router = { onAfterRouteChange: async (href: string) => { order.push(href) } }
        const remove = installMessageRouteCorrection(router, () => { order.push('correct') })
        for (const href of ['#subscribe', '#get', '#subscribe', '#get']) await router.onAfterRouteChange(href)
        expect(order).toEqual(['#subscribe', 'correct', '#get', 'correct', '#subscribe', 'correct', '#get', 'correct'])
        remove()
    })
    it('waits for an existing asynchronous hook and cancels pending work on unmount', async () => {
        let finish!: () => void
        const previous = () => new Promise<void>(resolve => { finish = resolve })
        const router = { onAfterRouteChange: previous }
        const correct = jest.fn()
        const remove = installMessageRouteCorrection(router, correct)
        const pending = router.onAfterRouteChange()
        expect(correct).not.toHaveBeenCalled()
        remove()
        finish()
        await pending
        expect(correct).not.toHaveBeenCalled()
        expect(router.onAfterRouteChange).toBe(previous)
    })
    it('preserves a deprecated completion hook and restores its original fallback', async () => {
        const previous = jest.fn()
        const correct = jest.fn()
        const router: { onAfterRouteChange?: (href: string) => void | Promise<void>; onAfterRouteChanged: typeof previous } = { onAfterRouteChanged: previous }
        const remove = installMessageRouteCorrection(router, correct)
        await router.onAfterRouteChange?.('#legacy')
        expect(previous).toHaveBeenCalledWith('#legacy')
        expect(correct).toHaveBeenCalledTimes(1)
        remove()
        expect(router.onAfterRouteChange).toBeUndefined()
        expect(router.onAfterRouteChanged).toBe(previous)
    })
    it('does not overwrite a later hook when this page unmounts', () => {
        const router = { onAfterRouteChange: jest.fn() }
        const remove = installMessageRouteCorrection(router, jest.fn())
        const later = jest.fn()
        router.onAfterRouteChange = later
        remove()
        expect(router.onAfterRouteChange).toBe(later)
    })
})
