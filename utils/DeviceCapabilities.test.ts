/** @jest-environment node */
import { readFileSync, existsSync } from 'node:fs'
import path from 'node:path'
import { compileScript, parse } from '@vue/compiler-sfc'
import { createSSRApp, h, type Component } from 'vue'
import { renderToString } from '@vue/server-renderer'
import ts from 'typescript'
import { capabilityRegistry as registry, capabilitiesForDevice, devicesForCapability, capabilityGroups, capabilitySidebar, currentDevicesForCapability } from './DeviceCapabilities'

const root = path.resolve(__dirname, '..')
const read = (file: string) => readFileSync(path.join(root, file), 'utf8')
function sourceForLink(link: string) {
    const route = link.split('#')[0].replace(/^\//, '')
    return [`${route}.md`, `${route}/index.md`, `${route}index.md`].find(file => existsSync(path.join(root, file)))
}

function component(filename: string): Component {
    const { descriptor } = parse(read(`components/${filename}`), { filename })
    const compiled = compileScript(descriptor, { id: 'capability-test', inlineTemplate: true })
    const javascript = ts.transpileModule(compiled.content, {
        compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS },
    }).outputText
    const exports: { default?: Component } = {}
    const resolve = (name: string) => name === 'vitepress'
        ? { withBase: (link: string) => `/docs/pr/40${link}` }
        : name.endsWith('.vue') ? { default: component(path.basename(name)), __esModule: true } : require(name)
    new Function('require', 'exports', javascript)(resolve, exports)
    return exports.default!
}

describe('Partial capability documentation registry', () => {
    test('keeps coverage partial and returns no features for an undocumented device', () => {
        expect(registry.coverage).toBe('partial')
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
            expect(row.note.trim()).not.toBe('')
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
            expect(read(sourceForLink(device.link)!)).toMatch(new RegExp(`<DeviceCapabilities\\b[^>]*\\bdevice=["']${device.id}["']`))
        }
    })

    test('generates grouped sidebar links from the registry', () => {
        expect(capabilitySidebar()).toEqual(capabilityGroups().map(group => ({
            text: group.title,
            collapsed: false,
            items: group.capabilities.map(capability => ({ text: capability.title, link: capability.link })),
        })))
    })

    test('does not infer BLE mappings, new-generation diagnostic LEDs or VTRTK support', () => {
        expect(devicesForCapability('ble-scanning')).toEqual([])
        expect(devicesForCapability('gps-gsm-status-leds').map(device => device.id)).toEqual(['PR2', 'ZE2', 'EN2'])
        expect(devicesForCapability('rgb-status-leds').map(device => device.id)).toEqual(['RH2'])
        expect(registry.devices.some(device => device.id === 'VTRTK')).toBe(false)
        expect(capabilitiesForDevice('PR3').map(feature => feature.capability)).toEqual(['four-power-leds'])
        expect(capabilitiesForDevice('PR2').map(feature => feature.link)).toContain('/devices/capabilities/gps-gsm-status-leds#pro-pr2')
        expect(capabilitiesForDevice('RH2')[0].detailLink).toBe('/devices/rtk/handheld/leds')
    })

    test('renders current device links without deleting legacy relationships', async () => {
        expect(currentDevicesForCapability('four-power-leds').map(device => device.id)).toEqual(['PR3', 'ZE2', 'EN2', 'VT3'])
        expect(currentDevicesForCapability('gps-gsm-status-leds').map(device => device.id)).toEqual(['ZE2', 'EN2'])
        expect(capabilitiesForDevice('PR2')).toHaveLength(2)
        expect(registry.devices.every(device => ['current', 'legacy'].includes(device.listing))).toBe(true)
        const html = await renderToString(createSSRApp(component('CapabilityDevices.vue'), { capability: 'four-power-leds' }))
        expect([...html.matchAll(/href="([^"]+)"/g)].map(match => match[1])).toEqual(
            currentDevicesForCapability('four-power-leds').map(device => `/docs/pr/40${device.link}`),
        )
        expect(html).not.toContain('PR2')
    })

    test('server-renders device and catalogue links under the deployment base', async () => {
        for (const [filename, props, links] of [
            ['DeviceCapabilities.vue', { device: 'RH2' }, ['/devices/capabilities/rgb-status-leds', '/devices/rtk/handheld/leds']],
            ['CapabilityCatalogue.vue', {}, registry.capabilities.map(capability => capability.link)],
        ] as const) {
            const html = await renderToString(createSSRApp(component(filename), props))
            expect([...html.matchAll(/href="([^"]+)"/g)].map(match => match[1])).toEqual(links.map(link => `/docs/pr/40${link}`))
        }
    })

    test('keeps capability prose before the device aside in reading order', async () => {
        const Overview = component('CapabilityOverview.vue')
        const html = await renderToString(createSSRApp({
            render: () => h(Overview, { capability: 'rgb-status-leds' }, () => h('p', 'The feature comes first.')),
        }))
        expect(html).toContain('The feature comes first.')
        expect(html.indexOf('The feature comes first.')).toBeLessThan(html.indexOf('<aside'))
        expect(html).toContain('/docs/pr/40/devices/rtk/handheld/')
    })
})
