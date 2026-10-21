import { createV1DescriptionOverrides } from './v1-overrides'

jest.mock('./v1-enums.js', () => jest.requireActual('./v1-enums'), { virtual: true })

describe.each(['/', '/docs/pr/99/'])('V1 description links under %s', base => {
    test('rebases documentation links once while preserving fragments and API examples', () => {
        const resolveLink = (url: string) => base + url.slice(1)
        const descriptions = createV1DescriptionOverrides(resolveLink)
        const text = Object.values(descriptions).join('\n')
        const links = [...text.matchAll(/\]\(([^)]+)\)/g)].map(match => match[1])
        expect(links).toHaveLength(9)
        expect(links.every(url => url.startsWith(base))).toBe(true)
        expect(descriptions['get-devices-id-readings']).toContain(`](${base}terminology/readings#types)`)
        expect(descriptions['get-devices-id-nearbyDevices']).toContain("curl --get 'https://api.lightbug.cloud/api/devices/TRACKER_ID/nearbyDevices'")
        expect(descriptions['get-devices-id-nearbyDeviceData']).toContain('`https://api.lightbug.cloud/api/devices/{trackerId}/nearbyDeviceData`')
        expect(createV1DescriptionOverrides(resolveLink)).toEqual(descriptions)
    })
})

test('build-time callers retain root-relative links by default', () => {
    expect(createV1DescriptionOverrides()['get-devices-id-readings'])
        .toContain('[readings](/terminology/readings)')
})
