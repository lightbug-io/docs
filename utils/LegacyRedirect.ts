/** Resolve a legacy documentation URL without escaping the configured deployment base. */
export function resolveLegacyRedirect(
    pathname: string,
    search: string,
    hash: string,
    base: string,
    redirects: [string, string][],
): string | undefined {
    if (!pathname.startsWith(base)) return
    const path = '/' + pathname.slice(base.length)
    const redirect = redirects.find(([from]) => path === from || path === from + '.html' || path.startsWith(from + '/'))
    if (!redirect) return

    const [from, to] = redirect
    const [targetPath, targetHash] = to.split('#', 2)
    const destination = base + targetPath.slice(1) + path.slice(from.length) + search
        + (targetHash ? '#' + targetHash : hash)
    return destination === pathname + search + hash ? undefined : destination
}
