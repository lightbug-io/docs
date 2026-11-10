/** @jest-environment node */
import { readFileSync, existsSync } from 'node:fs'
import path from 'node:path'
import { parse } from 'yaml'

const root = path.resolve(__dirname, '..')
const read = (file: string) => readFileSync(path.join(root, file), 'utf8')

describe('Pro generation documentation', () => {
    test('keeps the existing Pro URL and specification explicitly PR2-only', () => {
        const page = read('devices/pro/index.md')
        const spec = parse(read('public/device-specs/pro/v2.yaml'))
        expect(page).toContain('# ProN (PR2)')
        expect(page).toContain('device ID prefix 20')
        expect(spec.product).toMatchObject({ name: 'ProN (PR2)', sku: 'PR2', prefix: 20, version: 2 })
        expect(page).toContain('deviceTitle="ProN (PR2)"')
    })

    test('does not reuse the PR2 download or component data for Pro3', () => {
        const page = read('devices/pro/pro3.md')
        expect(page).not.toMatch(/import\s+spec|DownloadSpecButton|device-specs\/pro\/v2/)
        expect(page).toContain('not a complete Pro3 specification')
        expect(page).toContain('Cellular bands, wireless features, charging limits and certifications')
    })

    test('offers both generations through navigation and the existing page', () => {
        expect(read('.vitepress/config.mts')).toMatch(/text: 'Pro3 \(PR3\)',\s+link: '\/devices\/pro\/pro3'/)
        expect(read('devices/pro/index.md')).toContain('(/devices/pro/pro3)')
        expect(read('devices/pro/pro3.md')).toContain('(/devices/pro/)')
    })

    test('does not reintroduce unsupported PR2 connector and initial-charge claims', () => {
        const page = read('devices/pro/index.md')
        expect(page).not.toContain('charged using a USB-C connector')
        expect(page).not.toContain('charged for 8 hours')
    })

    test('keeps Pro3 LED guidance separate from the six-indicator guide', () => {
        const page = read('guides/pro3-leds.md')
        expect(page).toContain('four orange indicators')
        expect(page).toContain('hardware revisions 02–04')
        expect(page).toContain('There are no separate GPS and mobile-network status indicators.')
        expect(page).toContain('(/guides/tracker-leds)')
        expect(read('guides/tracker-leds.md')).toContain('(/guides/pro3-leds)')
    })

    test.each(['devices/pro/index.md', 'devices/pro/pro3.md', 'guides/pro3-leds.md'])('%s has existing local link and image targets', file => {
        for (const match of read(file).matchAll(/\]\((\/[^)]+)\)/g)) {
            const target = match[1].split('#')[0].split('?')[0]
            const candidates = [target + '.md', target + '/index.md', target + 'index.md', 'public' + target]
            expect(candidates.some(candidate => existsSync(path.join(root, candidate)))).toBe(true)
        }
    })
})
