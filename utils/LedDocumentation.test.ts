/** @jest-environment node */
import { readFileSync } from 'node:fs'
import path from 'node:path'

const root = path.resolve(__dirname, '..')
const read = (file: string) => readFileSync(path.join(root, file), 'utf8')

// These regression checks protect the generation boundaries, old URLs and
// shared source of battery thresholds. They do not replace hardware tests.
describe('Model-specific LED documentation', () => {
    test('makes Pro3 the only main Pro gallery and sidebar entry', () => {
        const gallery = read('devices.md')
        const core = read('.vitepress/config.mts').split("text: 'Core'")[1].split("text: 'RTK'")[0]
        expect(gallery).toContain("withBase('/devices/pro/pro3')")
        expect(gallery).not.toContain("withBase('/devices/pro/')")
        expect(core).toContain("link: '/devices/pro/pro3'")
        expect(core).not.toContain("link: '/devices/pro/'")
    })

    test('archives PR2 without inventing an end date or losing its URL', () => {
        const lineage = read('devices/history/index.md')
        const [current, legacy] = lineage.split('## Out of Production')
        expect(current).toContain('[Pro3](/devices/pro/pro3)')
        expect(current).not.toContain('SKU: PR2')
        expect(legacy).toContain('[ProN (PR2)](/devices/pro/)')
        expect(legacy.split('SKU: PR2')[1].split('\n')[0]).not.toContain('<td>Discontinued</td>')
        expect(read('devices/pro/index.md')).toContain('Legacy device')
        expect(read('devices/pro/index.md')).toContain('{#pro-pr2}')
        expect(lineage).toContain('{#lineage}')
    })

    test.each([
        ['Pro3', '/guides/pro3-leds'], ['ProN', '/guides/tracker-leds#pro-pr2'],
        ['Zero', '/guides/tracker-leds#zero-ze2'], ['Enviro', '/guides/tracker-leds#enviro-en2'],
        ['Vehicle', '/guides/vehicle-leds'], ['RH2', '/guides/rtk-leds#handheld-rtk-rh2'],
        ['VTRTK', '/guides/rtk-leds#vehicle-rtk-vtrtk'], ['ZE3', '/guides/ze3-leds'],
    ])('routes %s to a matching guide', (_name, target) => {
        expect(read('guides/leds.md')).toContain(`](${target})`)
    })

    test.each([
        'guides/pro3-leds.md', 'guides/tracker-leds.md', 'guides/vehicle-leds.md',
        'guides/rtk-leds.md', 'guides/ze3-leds.md',
    ])('%s uses one shared source for four-bar thresholds', file => {
        const page = read(file)
        expect(page).toContain('<!--@include: ../.vitepress/includes/led-battery-bars.md-->')
        expect(page).toContain('<!--@include: ../.vitepress/includes/led-bar-charging.md-->')
    })

    test.each(['zero', 'enviro'])('%s no longer borrows the PR2 restart example', model => {
        const tip = read(`devices/${model}/index.md`).split('::: tip LED help')[1].split(':::')[0]
        expect(tip).not.toContain('two-red-lights')
        expect(tip).toContain(`#${model}-`)
    })

    test('repairs the vehicle target and removes the generic blue-light check', () => {
        expect(read('devices/vehicle/index.md')).toContain('## Vehicle connection status')
        expect(read('devices/vehicle/installation.md')).not.toContain('a blue light will be visibly glowing')
        expect(read('guides/vehicle-leds.md')).toContain('not a left-to-right enclosure diagram')
    })

    test('separates RH2 RGB and application feedback from VTRTK bars', () => {
        const page = read('guides/rtk-leds.md')
        expect(page).toContain('99%')
        expect(page).toContain('When armed and active')
        expect(page).toContain("not RH2's RGB status display")
        expect(read('devices/api/sdks/toit/applications/survey/index.md')).toContain('**application-controlled feedback**')
    })

    test('keeps diagnostic colours and hardware revision caveats explicit', () => {
        const page = read('guides/tracker-leds.md')
        expect(page).toContain('Revision 05 uses yellow and red')
        expect(page).toContain('exact diagnostic colours must be checked')
        expect(page).toContain('previous')
        expect(read('guides/ze3-leds.md')).toContain('does not establish which firmware is installed')
    })

    test('removes contradictory universal reset timing and beep promises', () => {
        expect(read('faq/troubleshooting.md')).not.toContain('hold tracker button for 15 seconds')
        expect(read('devices/zero/index.md')).not.toContain('| 15 second |')
        expect(read('apps/cloud/reports/motion-data.md')).not.toContain('it should beep once')
        expect(read('apps/cloud/reports/motion-data.md')).not.toContain('You must then reset the device twice')
        expect(read('faq/troubleshooting.md')).toContain('Do not assume this action always preserves settings')
    })
})
