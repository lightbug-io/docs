export interface MessageOutlineEntry {
    id: string
    title: string
    label?: string
    depth: number
    legacy?: boolean
}

/** A compact breadcrumb and rail ancestry from the same ordered heading model. */
export function messageOutlineTrail(entries: MessageOutlineEntry[], activeId: string): MessageOutlineEntry[] {
    const index = Math.max(0, entries.findIndex(entry => entry.id === activeId))
    if (!entries[index]) return []
    const trail = [entries[index]]
    for (let i = index - 1; i >= 0; i--) {
        if (entries[i].depth < trail[0].depth) trail.unshift(entries[i])
    }
    return trail
}

/** Legacy methods are opt-in; their direct anchors remain available. */
export function visibleMessageOutlineEntries(entries: MessageOutlineEntry[], expandedLegacyIds: string[]): MessageOutlineEntry[] {
    return entries.filter(entry => !messageOutlineTrail(entries, entry.id).slice(0, -1)
        .some(parent => parent.legacy && !expandedLegacyIds.includes(parent.id)))
}

/** The rail does not cover content. Only the compact, visible bar adds clearance. */
export function messageNavigationOffset(navigation: HTMLElement): number {
    const bar = navigation.querySelector<HTMLElement>('[data-message-navigation-bar]') || navigation
    return (parseFloat(window.getComputedStyle(navigation).top) || 0) + bar.getBoundingClientRect().height + 16
}

function messageAnchorTop(target: HTMLElement): number {
    const style = window.getComputedStyle(target)
    return target.getBoundingClientRect().top + (parseFloat(style.paddingTop) || 0) + (parseFloat(style.borderTopWidth) || 0)
}

/** Resolve only this message's anchors and open all enclosing legacy disclosures. */
export function revealMessageAnchor(root: HTMLElement, hash: string): HTMLElement | null {
    let id: string
    try { id = decodeURIComponent(hash.replace(/^#/, '')) } catch { return null }
    const target = root.ownerDocument.getElementById(id)
    if (!target || !root.contains(target)) return null
    let ancestor: HTMLElement | null = target
    while (ancestor && root.contains(ancestor)) {
        if (ancestor.tagName === 'DETAILS') (ancestor as HTMLDetailsElement).open = true
        ancestor = ancestor.parentElement
    }
    return target
}

/** Select from curated, visible headings, not repeated example/frame headings. */
export function activeMessageOutlineId(entries: MessageOutlineEntry[], root: HTMLElement, offset: number, atBottom = false): string {
    const visible = entries.flatMap(entry => {
        const target = root.ownerDocument.getElementById(entry.id)
        if (!target || !root.contains(target) || !target.getClientRects().length) return []
        // Closed disclosures can retain layout boxes for their unpainted content.
        // Their summary remains visible, but its siblings must not become active.
        let ancestor = target.parentElement
        while (ancestor && root.contains(ancestor)) {
            if (ancestor.tagName === 'DETAILS' && !(ancestor as HTMLDetailsElement).open
                && !ancestor.querySelector(':scope > summary')?.contains(target)) return []
            ancestor = ancestor.parentElement
        }
        return [{ id: entry.id, top: messageAnchorTop(target) }]
    })
    if (atBottom && visible.length) return visible[visible.length - 1].id
    let active = visible[0]?.id || entries[0]?.id || ''
    for (const entry of visible) {
        if (entry.top > offset + 2) break
        active = entry.id
    }
    return active
}

/** Place visible anchor content below both the site header and compact outline.
 * Sections may have top padding, so align their content rather than the empty
 * outer edge. Read geometry after disclosures open and the router has scrolled.
 */
export function messageAnchorScrollTop(target: HTMLElement, jumpBar: HTMLElement): number {
    return Math.max(0, window.scrollY + messageAnchorTop(target) - messageNavigationOffset(jumpBar))
}

type RouteCompletion = (href: string) => void | Promise<void>

// Popstate can finish loading a page after hashchange, even when the page
// component is reused. Correct its anchor only after VitePress has queued its
// own scroll, without replacing another theme's route-completion behavior.
export function installMessageRouteCorrection(
    router: { onAfterRouteChange?: RouteCompletion; onAfterRouteChanged?: RouteCompletion },
    correct: () => void | Promise<void>,
): () => void {
    const original = router.onAfterRouteChange
    const previous = original ?? router.onAfterRouteChanged
    let active = true
    const afterRoute: RouteCompletion = async href => {
        await previous?.(href)
        if (active) await correct()
    }
    router.onAfterRouteChange = afterRoute
    return () => {
        active = false
        if (router.onAfterRouteChange === afterRoute) router.onAfterRouteChange = original
    }
}
