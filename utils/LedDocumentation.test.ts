/** @jest-environment node */
import { readFileSync, existsSync } from 'node:fs'
import path from 'node:path'
import { capabilitiesForDevice, devicesForCapability, capabilitySidebar } from './DeviceCapabilities'

const root = path.resolve(__dirname, '..')
const read = (file: string) => readFileSync(path.join(root, file), 'utf8')
const capabilityNames = ['four-power-leds', 'gps-gsm-status-leds', 'rgb-status-leds']

// Protect the capability architecture, model boundaries and deliberately narrow scope.
// These documentation checks do not replace hardware tests.
describe('Reusable LED capabilities', () => {
    test.each(capabilityNames)('%s is discoverable from the capability index and sidebar', name => {
        expect(read('devices/capabilities/index.md')).toContain('<CapabilityCatalogue />')
        expect(read('.vitepress/config.mts')).toContain('items: capabilitySidebar()')
        expect(capabilitySidebar().flatMap(group => group.items).some(item => item.link.endsWith(name))).toBe(true)
        expect(read('guides/leds.md')).toContain(`/devices/capabilities/${name}`)
    })

    test('defines four-bar thresholds once, on the capability page', () => {
        const page = read('devices/capabilities/four-power-leds.md')
        expect(page).toContain('| 20% to below 40% | 1 indicator |')
        expect(page).toContain('| 80% or more | 4 indicators |')
        expect(page).toContain('Below about 95%')
        for (const file of ['devices/pro/index.md', 'devices/history/PR2.md', 'devices/zero/index.md', 'devices/enviro/index.md', 'devices/vehicle/index.md']) {
            expect(read(file)).toContain('<DeviceCapabilities device=')
            expect(read(file)).not.toContain('| 20% to below 40% |')
        }
        expect(existsSync(path.join(root, '.vitepress/includes/led-battery-bars.md'))).toBe(false)
    })

    test('keeps diagnostic colours and sleeping GPS caveats explicit', () => {
        const page = read('devices/capabilities/gps-gsm-status-leds.md')
        expect(page).toContain('Revision 05 uses yellow and red')
        expect(page).toContain('exact diagnostic colours must be checked')
        expect(page).toContain('**previous**')
        expect(page).toContain('not present on Pro3 or ZE3')
    })

    test.each(['zero', 'enviro'])('%s declares both power and diagnostic capabilities', model => {
        const page = read(`devices/${model}/index.md`)
        expect(page).toContain('## Feature guides')
        const features = capabilitiesForDevice(model === 'zero' ? 'ZE2' : 'EN2')
        expect(features.map(feature => feature.capability)).toEqual(['four-power-leds', 'gps-gsm-status-leds'])
    })

    test('puts RH2 implementation details under the device, not in a guide or generic capability', () => {
        const device = read('devices/rtk/handheld/leds.md')
        const capability = read('devices/capabilities/rgb-status-leds.md')
        expect(read('devices/rtk/handheld/index.md')).toContain('<DeviceCapabilities device="RH2" />')
        expect(capabilitiesForDevice('RH2')[0].detailLink).toBe('/devices/rtk/handheld/leds')
        expect(device).toContain('/devices/capabilities/rgb-status-leds')
        expect(device).toContain('99%')
        expect(device).toContain('When armed and active')
        expect(device).toContain('## Application-controlled feedback')
        expect(capability).toContain('<CapabilityOverview capability="rgb-status-leds">')
        expect(devicesForCapability('rgb-status-leds')[0].id).toBe('RH2')
        expect(capability).not.toContain('| Below 30% |')
    })

    test('links Survey feedback to RH2 device details', () => {
        expect(read('devices/api/sdks/toit/applications/survey/index.md')).toContain('/devices/rtk/handheld/leds#application-controlled-feedback')
    })

    test('keeps VT3 connection patterns on the VT3 page', () => {
        const page = read('devices/vehicle/index.md')
        expect(page).toContain('## Vehicle connection status')
        expect(page).toContain('| 1 and 2 |')
        expect(page).toContain('not a left-to-right enclosure diagram')
        expect(read('devices/vehicle/installation.md')).not.toContain('a blue light will be visibly glowing')
    })

    test('does not add VTRTK LED documentation', () => {
        expect(read('devices/rtk/vehicle.md')).not.toContain('## LED')
        expect(read('guides/leds.md')).not.toContain('VTRTK')
    })

    test('leaves existing reset procedures outside this change', () => {
        expect(read('faq/troubleshooting.md')).not.toContain('## Restarting a tracker')
        expect(read('faq/troubleshooting.md')).toContain('hold tracker button for 15 seconds')
        expect(read('devices/zero/index.md')).toContain('| 15 second |')
        expect(read('apps/cloud/reports/motion-data.md')).toContain('You must then reset the device twice')
        expect(read('guides/leds.md')).not.toContain('restarting-a-tracker')
    })

    test.each(['pro3-leds', 'tracker-leds', 'vehicle-leds', 'rtk-leds', 'ze3-leds'])('removes the duplicated %s guide', name => {
        expect(existsSync(path.join(root, `guides/${name}.md`))).toBe(false)
    })

    test('keeps the practical guide linked to the PR2 startup example', () => {
        expect(read('guides/leds.md')).toContain('/devices/history/PR2#two-red-lights-and-four-orange-lights-after-a-restart')
        expect(read('faq/troubleshooting.md')).toContain('/devices/history/PR2#two-red-lights-and-four-orange-lights-after-a-restart')
    })
})
