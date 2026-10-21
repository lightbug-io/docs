import { resolveLegacyRedirect } from './LegacyRedirect'

const redirects: [string, string][] = [
    ['/devices/legacy', '/devices/history'],
    ['/apps/admin/permissions', '/apps/admin/authentication#permissions'],
    ['/terminology', '/terminology'],
]

describe.each(['/', '/docs/pr/99/'])('legacy redirects under %s', base => {
    test('retains the deployment base, nested path, query and fragment', () => {
        expect(resolveLegacyRedirect(base + 'devices/legacy/zero', '?q=a%20b', '#details', base, redirects))
            .toBe(base + 'devices/history/zero?q=a%20b#details')
    })
    test('retains legacy .html URL support without matching arbitrary prefixes', () => {
        expect(resolveLegacyRedirect(base + 'devices/legacy.html', '?q=1', '#details', base, redirects))
            .toBe(base + 'devices/history.html?q=1#details')
    })
    test('puts the query before a replacement fragment', () => {
        expect(resolveLegacyRedirect(base + 'apps/admin/permissions', '?role=admin', '#old', base, redirects))
            .toBe(base + 'apps/admin/authentication?role=admin#permissions')
    })
    test('avoids redirect loops and partial path matches', () => {
        expect(resolveLegacyRedirect(base + 'terminology/missing', '', '', base, redirects)).toBeUndefined()
        expect(resolveLegacyRedirect(base + 'devices/legacy-extra', '', '', base, redirects)).toBeUndefined()
        expect(resolveLegacyRedirect(base + 'unrelated', '', '', base, redirects)).toBeUndefined()
    })
})

test('does not redirect a path outside the preview', () => {
    expect(resolveLegacyRedirect('/devices/legacy', '', '', '/docs/pr/99/', redirects)).toBeUndefined()
})
