/** @jest-environment node */
import { readFileSync } from 'node:fs'
import path from 'node:path'

const publicProductFiles = [
    'README.md',
    'data/device-capabilities.json',
    'devices/capabilities/four-power-leds.md',
    'devices/capabilities/gps-gsm-status-leds.md',
    'devices/capabilities/index.md',
    'devices/enviro/index.md',
    'devices/history/PR2.md',
    'devices/history/index.md',
    'devices/pro/index.md',
    'devices/vehicle/index.md',
    'devices/zero/index.md',
    'guides/leds.md',
]

describe('public product documentation', () => {
    test.each(publicProductFiles)('%s keeps internal hardware revision details out of public content', file => {
        const source = readFileSync(path.join(__dirname, '..', file), 'utf8')
        expect(source).not.toMatch(/\brevisions?\b/i)
    })
})
