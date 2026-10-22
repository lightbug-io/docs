import { activeMessageOutlineId, installMessageRouteCorrection, messageAnchorScrollTop, messageNavigationOffset, messageOutlineTrail, visibleMessageOutlineEntries, revealMessageAnchor, type MessageOutlineEntry } from './MessageAnchor'

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


describe('responsive message outline', () => {
    const entries: MessageOutlineEntry[] = [
        { id: 'overview', title: 'Overview', depth: 0 },
        { id: 'current', title: 'Current format', label: 'Current', depth: 0 },
        { id: 'fields', title: 'Message fields', depth: 1 },
        { id: 'get', title: 'GET', depth: 1 },
        { id: 'subscribe', title: 'SUBSCRIBE', depth: 1 },
        { id: 'legacy', title: 'Legacy format', depth: 0, legacy: true },
        { id: 'legacy-get', title: 'GET: Read legacy state', depth: 1 },
        { id: 'constants', title: 'Message and field constants', depth: 0 },
    ]
    let root: HTMLElement
    const heading = (id: string, top: number, visible = () => true, parent = root) => {
        const node = document.createElement('h2')
        node.id = id
        node.getBoundingClientRect = () => ({ top, height: 24 } as DOMRect)
        node.getClientRects = () => (visible() ? [node.getBoundingClientRect()] : []) as unknown as DOMRectList
        parent.append(node)
        return node
    }
    beforeEach(() => {
        document.body.replaceChildren()
        root = document.createElement('article')
        document.body.append(root)
        Object.defineProperty(window, 'scrollY', { configurable: true, value: 1000 })
    })
    it('uses compact clearance but never subtracts the tall desktop rail', () => {
        const navigation = document.createElement('nav')
        navigation.style.top = '64px'
        navigation.getBoundingClientRect = () => ({ height: 640 } as DOMRect)
        const bar = document.createElement('div')
        bar.dataset.messageNavigationBar = ''
        bar.getBoundingClientRect = () => ({ height: 72 } as DOMRect)
        navigation.append(bar)
        root.append(navigation)
        const target = heading('get', 500)
        expect(messageNavigationOffset(navigation)).toBe(152)
        expect(messageAnchorScrollTop(target, navigation)).toBe(1348)
        bar.getBoundingClientRect = () => ({ height: 0 } as DOMRect)
        expect(messageNavigationOffset(navigation)).toBe(80)
        expect(messageAnchorScrollTop(target, navigation)).toBe(1420)
    })
    it('selects the section at the same padded offset used to land an anchor', () => {
        heading('overview', -500)
        const operation = heading('get', 100)
        operation.style.paddingTop = '28px'
        operation.style.borderTop = '3px solid black'
        heading('get-request', 300)
        expect(activeMessageOutlineId(entries, root, 130)).toBe('get')
        expect(activeMessageOutlineId(entries, root, 128)).toBe('overview')
        expect(activeMessageOutlineId(entries, root, 300)).toBe('get')
        // Request, response and example headings keep their parent method active.
        heading('get-response', 320)
        heading('frame-example', 350)
        expect(activeMessageOutlineId(entries, root, 400)).toBe('get')
        expect(revealMessageAnchor(root, '#get-response')?.id).toBe('get-response')
    })
    it('skips closed legacy headings and includes them after revealing any old field link', () => {
        heading('overview', -200)
        const details = document.createElement('details')
        details.id = 'legacy'
        const summary = document.createElement('summary')
        summary.textContent = 'Legacy format'
        details.append(summary)
        details.getBoundingClientRect = () => ({ top: -100, height: 40 } as DOMRect)
        details.getClientRects = () => [details.getBoundingClientRect()] as unknown as DOMRectList
        root.append(details)
        // Browsers can retain nonempty layout rects inside a closed disclosure.
        heading('legacy-get', -50, () => true, details)
        const field = heading('legacy-get-field-1', 0, () => true, details)
        expect(activeMessageOutlineId(entries, root, 80)).toBe('legacy')
        expect(revealMessageAnchor(root, '#legacy-get-field-1')).toBe(field)
        expect(details.open).toBe(true)
        expect(activeMessageOutlineId(entries, root, 80)).toBe('legacy-get')
        details.open = false
        expect(activeMessageOutlineId(entries, root, 80)).toBe('legacy')
        expect(revealMessageAnchor(root, '#legacy-get-field-1')).toBe(field)
        expect(details.open).toBe(true)
    })
    it('keeps visible summary anchors but skips nested content inside a closed outer disclosure', () => {
        heading('overview', -200)
        const outer = document.createElement('details')
        const summary = document.createElement('summary')
        outer.append(summary)
        root.append(outer)
        heading('legacy', -100, () => true, summary)
        const inner = document.createElement('details')
        inner.open = true
        outer.append(inner)
        heading('legacy-get', -50, () => true, inner)
        expect(activeMessageOutlineId(entries, root, 80)).toBe('legacy')
        expect(activeMessageOutlineId(entries, root, 80, true)).toBe('legacy')
        outer.open = true
        expect(activeMessageOutlineId(entries, root, 80)).toBe('legacy-get')
    })
    it('resolves encoded aliases and opens nested disclosures without touching another page', () => {
        root.innerHTML = '<details><summary>Legacy</summary><details><summary>More</summary><span id="old field"></span></details></details>'
        expect(revealMessageAnchor(root, '#old%20field')?.id).toBe('old field')
        expect(Array.from(root.querySelectorAll('details')).every(details => details.open)).toBe(true)
        const elsewhere = document.createElement('div')
        elsewhere.id = 'outside'
        document.body.append(elsewhere)
        expect(revealMessageAnchor(root, '#outside')).toBeNull()
        expect(revealMessageAnchor(root, '#missing')).toBeNull()
        expect(revealMessageAnchor(root, '#%invalid')).toBeNull()
        expect(revealMessageAnchor(root, '')).toBeNull()
    })
    it('keeps a useful fallback above the first section, with no headings, and at page end', () => {
        heading('overview', 300)
        heading('constants', 1200)
        expect(activeMessageOutlineId(entries, root, 80)).toBe('overview')
        expect(activeMessageOutlineId(entries, root, 80, true)).toBe('constants')
        root.replaceChildren()
        expect(activeMessageOutlineId(entries, root, 80)).toBe('overview')
        expect(activeMessageOutlineId([], root, 80)).toBe('')
    })
    it('keeps a short format/method trail without request or response stages', () => {
        expect(messageOutlineTrail(entries, 'get').map(entry => entry.label || entry.title)).toEqual(['Current', 'GET'])
        expect(messageOutlineTrail(entries, 'subscribe').map(entry => entry.id)).toEqual(['current', 'subscribe'])
        expect(messageOutlineTrail(entries, 'legacy-get').map(entry => entry.id)).toEqual(['legacy', 'legacy-get'])
        expect(messageOutlineTrail(entries, 'constants').map(entry => entry.id)).toEqual(['constants'])
        expect(messageOutlineTrail(entries, 'missing').map(entry => entry.id)).toEqual(['overview'])
        expect(messageOutlineTrail([], 'missing')).toEqual([])
    })
    it('hides legacy methods until opted into without removing their destinations', () => {
        expect(visibleMessageOutlineEntries(entries, []).map(entry => entry.id)).not.toContain('legacy-get')
        expect(visibleMessageOutlineEntries(entries, []).map(entry => entry.id)).toContain('legacy')
        expect(visibleMessageOutlineEntries(entries, ['legacy'])).toEqual(entries)
        expect(visibleMessageOutlineEntries(entries, []).map(entry => entry.id)).toContain('constants')
    })
    it('leaves formatless method navigation unchanged', () => {
        const formatless = entries.filter(entry => ['overview', 'fields', 'get', 'subscribe', 'constants'].includes(entry.id))
            .map(entry => ({ ...entry, depth: 0 }))
        expect(visibleMessageOutlineEntries(formatless, [])).toEqual(formatless)
        expect(messageOutlineTrail(formatless, 'get').map(entry => entry.id)).toEqual(['get'])
    })

})
