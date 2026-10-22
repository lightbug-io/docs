import { messageAnchorScrollTop } from './MessageAnchor'

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
