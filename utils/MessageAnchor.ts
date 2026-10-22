/** Place visible anchor content below both the site header and message jump bar.
 * Sections may have top padding, so align their content rather than the empty
 * outer edge. Read geometry after disclosures open and the router has scrolled.
 */
export function messageAnchorScrollTop(target: HTMLElement, jumpBar: HTMLElement): number {
    const stickyTop = parseFloat(window.getComputedStyle(jumpBar).top) || 0
    const targetPadding = parseFloat(window.getComputedStyle(target).paddingTop) || 0
    const targetBorder = parseFloat(window.getComputedStyle(target).borderTopWidth) || 0
    return Math.max(0, window.scrollY + target.getBoundingClientRect().top + targetPadding + targetBorder
        - stickyTop - jumpBar.getBoundingClientRect().height - 16)
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
