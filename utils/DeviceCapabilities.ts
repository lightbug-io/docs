import registry from '../data/device-capabilities.json'

// This is a documentation index, not a complete hardware compatibility database.
export const capabilityRegistry = registry

export function capabilityGroups() {
    return registry.groups.map(group => ({
        ...group,
        capabilities: registry.capabilities.filter(capability => capability.group === group.id),
    }))
}

export function capabilitySidebar() {
    return capabilityGroups().map(group => ({
        text: group.title,
        collapsed: false,
        items: group.capabilities.map(capability => ({ text: capability.title, link: capability.link })),
    }))
}

export function capabilitiesForDevice(deviceId: string) {
    return registry.relationships.filter(relation => relation.device === deviceId).map(relation => {
        const capability = registry.capabilities.find(item => item.id === relation.capability)!
        return {
            ...relation,
            title: capability.title,
            link: capability.link + (relation.capabilityAnchor ? `#${relation.capabilityAnchor}` : ''),
        }
    })
}

export function devicesForCapability(capabilityId: string) {
    return registry.relationships.filter(relation => relation.capability === capabilityId).map(relation => ({
        ...relation,
        ...registry.devices.find(item => item.id === relation.device)!,
    }))
}

/** Current documentation listings only; legacy relationships remain available elsewhere. */
export function currentDevicesForCapability(capabilityId: string) {
    return devicesForCapability(capabilityId).filter(device => device.listing === 'current')
}
