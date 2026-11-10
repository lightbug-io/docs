/** @jest-environment node */
import { readFileSync, existsSync } from 'node:fs'
import path from 'node:path'
import { capabilityRegistry as registry, capabilitiesForDevice, devicesForCapability, capabilityGroups, capabilitySidebar, currentDevicesForCapability } from './DeviceCapabilities'

const root = path.resolve(__dirname, '..')
const read = (file: string) => readFileSync(path.join(root, file), 'utf8')
function sourceForLink(link: string) {
    const route = link.split('#')[0].replace(/^\//, '')
    return [`${route}.md`, `${route}/index.md`, `${route}index.md`].find(file => existsSync(path.join(root, file)))
}

describe('Partial capability documentation registry', () => {
    test('labels partial coverage, never treats an absent mapping as unsupported', () => {
        expect(registry.coverage).toBe('partial')
        expect(read('components/DeviceCapabilities.vue')).toContain('not a complete feature list')
        expect(read('components/CapabilityDevices.vue')).toContain('Documented so far')
        expect(read('devices/capabilities/index.md')).toContain('not a statement that it is unsupported')
        expect(capabilitiesForDevice('not-yet-documented')).toEqual([])
    })

    test('has unique definitions and relationships, with no unknown IDs or empty groups', () => {
        for (const entries of [registry.devices, registry.capabilities, registry.groups]) {
            expect(new Set(entries.map(entry => entry.id)).size).toBe(entries.length)
        }
        const keys = registry.relationships.map(row => `${row.device}:${row.capability}`)
        expect(new Set(keys).size).toBe(keys.length)
        for (const row of registry.relationships) {
            expect(registry.devices.some(device => device.id === row.device)).toBe(true)
            expect(registry.capabilities.some(capability => capability.id === row.capability)).toBe(true)
            expect(row.note.length).toBeGreaterThan(10)
        }
        for (const capability of registry.capabilities) {
            expect(registry.groups.some(group => group.id === capability.group)).toBe(true)
        }
        expect(capabilityGroups().every(group => group.capabilities.length > 0)).toBe(true)
    })

    test('resolves every registry route and explicit relationship anchor', () => {
        const links = [...registry.devices.map(item => item.link), ...registry.capabilities.map(item => item.link), ...registry.relationships.flatMap(row => row.detailLink ? [row.detailLink] : []), ...registry.devices.flatMap(device => capabilitiesForDevice(device.id).map(feature => feature.link))]
        for (const link of links) {
            const source = sourceForLink(link)
            expect(source).toBeDefined()
            const anchor = link.split('#')[1]
            if (anchor) {
                const text = read(source!)
                const headings = [...text.matchAll(/^#{1,6} (.+)$/gm)].map(match => match[1].toLowerCase().replace(/[^a-z0-9 -]/g, '').replace(/ /g, '-'))
                expect(text.includes(`{#${anchor}}`) || headings.includes(anchor)).toBe(true)
            }
        }
    })

    test('generates both directions from the same relationships', () => {
        for (const row of registry.relationships) {
            expect(capabilitiesForDevice(row.device).some(feature => feature.capability === row.capability)).toBe(true)
            expect(devicesForCapability(row.capability).some(device => device.id === row.device && device.note === row.note)).toBe(true)
        }
        for (const device of registry.devices) {
            expect(read(sourceForLink(device.link)!)).toContain(`<DeviceCapabilities device="${device.id}" />`)
        }
    })

    test('groups LED navigation instead of a flat capability menu', () => {
        const sidebar = capabilitySidebar()
        expect(sidebar.find(group => group.text === 'LED indicators')!.items).toHaveLength(3)
        expect(sidebar.find(group => group.text === 'Connectivity')!.items[0].text).toBe('BLE scanning')
        expect(read('.vitepress/config.mts')).toContain('items: capabilitySidebar()')
    })

    test('does not infer BLE mappings, new-generation diagnostic LEDs or VTRTK support', () => {
        expect(devicesForCapability('ble-scanning')).toEqual([])
        expect(devicesForCapability('gps-gsm-status-leds').map(device => device.id)).toEqual(['PR2', 'ZE2', 'EN2'])
        expect(devicesForCapability('rgb-status-leds').map(device => device.id)).toEqual(['RH2'])
        expect(registry.devices.some(device => device.id === 'VTRTK')).toBe(false)
    })

    test('current-only boxes omit PR2 without deleting legacy relationships', () => {
        expect(currentDevicesForCapability('four-power-leds').map(device => device.id)).toEqual(['PR3', 'ZE2', 'EN2', 'VT3'])
        expect(currentDevicesForCapability('gps-gsm-status-leds').map(device => device.id)).toEqual(['ZE2', 'EN2'])
        expect(capabilitiesForDevice('PR2')).toHaveLength(2)
        expect(registry.devices.every(device => ['current', 'legacy'].includes(device.listing))).toBe(true)
        expect(read('components/CapabilityDevices.vue')).toContain('currentDevicesForCapability(props.capability)')
        expect(read('components/CapabilityDevices.vue')).not.toContain('{{ device.note }}')
    })

    test('capability introductions use a small responsive side box rather than a primary device section', () => {
        for (const capability of ['four-power-leds', 'gps-gsm-status-leds', 'rgb-status-leds']) {
            const page = read(`devices/capabilities/${capability}.md`)
            expect(page).toContain(`<CapabilityOverview capability="${capability}">`)
            expect(page).not.toContain('## Devices\n')
        }
        expect(read('components/CapabilityOverview.vue')).toContain('@container (min-width: 36rem)')
        expect(read('components/CapabilityOverview.vue')).toContain('<slot />')
        expect(read('devices/capabilities/four-power-leds.md')).not.toContain("These are battery-bar patterns, not RH2's RGB charging colours.")
    })

    test('legacy navigation ends with the older devices anchor', () => {
        expect(read('.vitepress/config.mts')).toContain("{ text: 'Older...', link: '/devices/history/#out-of-production' }")
        expect(read('devices/history/index.md')).toContain('## Out of Production')
    })

    test('base-aware components link with withBase and render without client-only gates', () => {
        for (const component of ['DeviceCapabilities', 'CapabilityDevices', 'CapabilityCatalogue']) {
            const source = read(`components/${component}.vue`)
            expect(source).toContain('withBase(')
            expect(source).not.toContain('<ClientOnly>')
        }
    })
})
