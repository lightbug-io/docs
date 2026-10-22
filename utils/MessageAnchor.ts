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
