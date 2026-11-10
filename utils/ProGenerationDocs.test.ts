/** @jest-environment node */
import { readFileSync, existsSync } from 'node:fs'
import path from 'node:path'
import { parse } from 'yaml'
import { capabilitiesForDevice } from './DeviceCapabilities'

const root = path.resolve(__dirname, '..')
const read = (file: string) => readFileSync(path.join(root, file), 'utf8')

describe('Pro generation documentation', () => {
    test('uses the current Pro route for PR3 without importing the PR2 specification', () => {
        const page = read('devices/pro/index.md')
        expect(page).toContain('\n# Pro\n')
        expect(page).toContain('The current Pro is Pro3 (PR3)')
        expect(page).toContain("../../public/device-specs/pro/v3.yaml?raw")
        expect(page).toContain('deviceTitle="Pro (PR3)"')
        expect(page).not.toMatch(/device-specs\/pro\/v2/)
        expect(page).toContain('device ID prefix 52')
        expect(page).toContain('The overview, tables and PDF use the same Pro3 specification.')
        expect(existsSync(path.join(root, 'devices/pro/pro3.md'))).toBe(false)
    })

    test('archives PR2 using the existing history convention and its own specification', () => {
        const page = read('devices/history/PR2.md')
        const spec = parse(read('public/device-specs/pro/v2.yaml'))
        expect(page).toContain('# PR2 (ProN) {#pro-pr2}')
        expect(page).toContain('device ID prefix 20')
        expect(page).toContain("../../public/device-specs/pro/v2.yaml?raw")
        expect(page).toContain('deviceTitle="ProN (PR2)"')
        expect(spec.product).toMatchObject({ name: 'ProN (PR2)', sku: 'PR2', prefix: 20, version: 2 })
        expect(existsSync(path.join(root, 'devices/history/VT2.md'))).toBe(true)
    })

    test('routes the main gallery to PR3 and legacy navigation to PR2', () => {
        const config = read('.vitepress/config.mts')
        expect(config).toMatch(/text: 'Pro',\s+link: '\/devices\/pro\/'/)
        expect(config).toContain("{ text: 'ProN (PR2)', link: '/devices/history/PR2' }")
        expect(read('devices.md')).toContain("withBase('/devices/pro/')")
        expect(read('devices.md')).not.toContain('/devices/pro/pro3')
    })

    test('keeps the lineage listing and generation links consistent', () => {
        const lineage = read('devices/history/index.md')
        const [current, legacy] = lineage.split('## Out of Production')
        expect(current).toContain('[Pro3](/devices/pro/)')
        expect(current).not.toContain('SKU: PR2')
        expect(legacy).toContain('[ProN (PR2)](/devices/history/PR2)')
        expect(read('devices/pro/index.md')).toContain('[ProN/PR2 archive](/devices/history/PR2)')
        expect(read('devices/history/PR2.md')).toContain('(/devices/pro/)')
    })

    test('separates PR3 power LEDs from the older PR2 diagnostic pair', () => {
        const current = read('devices/pro/index.md')
        const legacy = read('devices/history/PR2.md')
        expect(current).toContain('On revisions 02–04')
        expect(capabilitiesForDevice('PR3')[0].note).toContain('Four orange indicators')
        expect(current).toContain('does not have the separate')
        expect(capabilitiesForDevice('PR2')[1].link).toBe('/devices/capabilities/gps-gsm-status-leds#pro-pr2')
        expect(legacy).toContain('## Two red lights and four orange lights after a restart')
    })

    test.each(['devices/pro/index.md', 'devices/history/PR2.md'])('%s links to existing local pages and assets', file => {
        for (const match of read(file).matchAll(/\]\((\/[^)]+)\)/g)) {
            const target = match[1].split('#')[0].split('?')[0]
            const candidates = [target + '.md', target + '/index.md', target + 'index.md', 'public' + target]
            expect(candidates.some(candidate => existsSync(path.join(root, candidate)))).toBe(true)
        }
    })
})
