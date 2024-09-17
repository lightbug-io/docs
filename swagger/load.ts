import spec1 from '../swagger/v1.json' with { type: 'json' }
import spec2 from '../swagger/v2.json' with { type: 'json' }

const v1SummaryOverrides = {
    'post-users-login': 'Login',
    'get-users-id-getMqttCredentials': 'MQTT Credentials',
    // points
    'get-devices-id-points-fk': 'Get device point by id',
    'get-devices-id-points': 'Get device points',
    'delete-devices-id-points-fk': 'Delete device point by id',
    // readings
    'get-devices-id-readings-fk': 'Get device reading by id',
    'get-devices-id-readings': 'Get device readings',
    'put-devices-id-gatewayReadings-fk': 'Update device reading by id',

    // device
    'get-devices-id': 'Get device',
    'get-users-id-getDeviceSummary': 'Summary of devices',

    // device config stuff
    'get-devices-id-setupSqsForwarding': 'Set SQS forwarding for a device',
    'get-devices-id-setMetaItem': 'Set meta item for a device',
    'get-devices-id-flightMode': 'Set flight mode for a device',

    'get-devices-id-gatewayReadings-fk': 'Get device gateway reading by id',
    'delete-devices-id-gatewayReadings-fk': 'Delete device gateway reading by id',

    'post-devices-id-messages': 'Send a new message to the device',
    'delete-devices-id-messages': 'Delete all messages for a device',
    'get-users-id-getDevicesInZone': 'Devices in zone',
    'get-users-id-getDevicesByTag': 'Devices with tag',

    // TODO notificatio triggers should probably render in swagger with better names
    'get-devices-id-notificationTriggers': 'Get device triggers',
    'get-devices-id-notificationTriggers-fk': 'Get device trigger by id',
    'put-devices-id-notificationTriggers-fk': 'Update device trigger by id',
    'delete-devices-id-notificationTriggers-fk': 'Delete device trigger by id',
    'post-devices-id-notificationTriggers': 'Create device trigger',
    'delete-devices-id-notificationTriggers': 'Delete all device triggers',
    // TODO geofences should have better default summaries
    'get-users-id-geofences-fk': 'Get user geofence by id',
    'get-users-id-geofences': 'Get user geofences',
    'put-users-id-geofences-fk': 'Update user geofence by id',
    'delete-users-id-geofences-fk': 'Delete user geofence by id',
    'post-users-id-geofences': 'Create user geofence',
    'delete-users-id-geofences': 'Delete all user geofences',
}

const v1DescriptionOverrides = {
    'get-users-id-getMqttCredentials': 'Retrieves a users MQTT Credentials if set, for legacy use in connecting to MQTT.',
    'get-users-id-getDeviceSummary': 'Lists all devices for a user, with a summary of state, including most resent points.',
}

const v1RemoveSecurity = [
    'post-users-login',
]

const v1Deprecated = [
    'get-devices-id-transients-fk',
]

const v1ReTag = {
    // Keep the MQTT in its own section, near the bottom
    'get-users-id-getMqttCredentials': 'mqtt',

    // TODO geofences should probably render in swagger with their own tag
    'put-users-id-geofences-fk': 'geofences',
    'delete-users-id-geofences-fk': 'geofences',
    'post-users-id-geofences': 'geofences',
    'delete-users-id-geofences': 'geofences',

    // Split out gateway readings for clarity
    'get-devices-id-gatewayReadings-fk': 'readings-gateway',
    'delete-devices-id-gatewayReadings-fk': 'readings-gateway',

    // Split out device config for clarity
    'get-devices-id-config': 'device-config',
    'put-devices-id-config': 'device-config',
    'post-devices-id-setSafeZone': 'device-config',
    'get-devices-id-setupSqsForwarding': 'device-config',
    'get-devices-id-setMetaItem': 'device-config',
    'get-devices-id-flightMode': 'device-config',
    'get-devices-id-getSafeZone': 'device-config',

    'post-devices-id-messages': 'device-misc',
    'delete-devices-id-messages': 'device-misc',
    'get-devices-id-transients': 'device-misc',
    'get-devices-id-transients-fk': 'device-misc',
    'get-devices-id-nearbyDevices': 'device-misc',
    'get-devices-id-nearbyDeviceData': 'device-misc',
}

const v1Removed = [
    // At the time of writing the new docs site, this endpoint had been removed
    'delete-devices-id-gatewayReadings-fk',
    'delete-devices-id-transients-fk',
    'put-devices-id-transients-fk',
    'get-devices-id-transients-fk',
]

export function loadSpec(version: number): any {
    if (version === 1) {
        // override all operations, to align with the "default" by the theme
        // v2 doesnt have operation ids set, and just relies on this default too, and its "quite" nice
        // method-path (where - is in place of / in the path)
        for (const path of Object.keys(spec1.paths)) {
            for (const method of Object.keys(spec1.paths[path])) {
                const operationId = `${method}${path.replace(/\//g, '-')}`
                spec1.paths[path][method].operationId = operationId
                // Also remove any { and } from the operationId
                spec1.paths[path][method].operationId = operationId.replace(/{|}/g, '')
            }
        }

        // override the summary of paths, based on the operation
        for (const path of Object.keys(spec1.paths)) {
            for (const method of Object.keys(spec1.paths[path])) {
                const operationId = spec1.paths[path][method].operationId
                if (v1Removed.includes(operationId)) {
                    delete spec1.paths[path][method]
                    continue
                }
                if (operationId in v1SummaryOverrides) {
                    spec1.paths[path][method].summary = v1SummaryOverrides[operationId]
                }
                if (operationId in v1DescriptionOverrides) {
                    spec1.paths[path][method].description = v1DescriptionOverrides[operationId]
                }
                if (v1RemoveSecurity.includes(operationId)) {
                    spec1.paths[path][method].security = []
                }
                if (operationId in v1ReTag) {
                    spec1.paths[path][method].tags = [v1ReTag[operationId]]
                }
                if (operationId in v1Deprecated) {
                    spec1.paths[path][method].deprecated = true
                    // Until this is actually rendered, also prefix the summary with "Deprecated"
                    spec1.paths[path][method].summary = `Deprecated: ${spec1.paths[path][method].summary}`
                    // and the description
                    spec1.paths[path][method].description = `This endpoint is deprecated. ${spec1.paths[path][method].description}`
                }
                // If a method has a paremeter called include, then it is never required...
                if (spec1.paths[path][method].parameters) {
                    for (const param of spec1.paths[path][method].parameters) {
                        if (param.name === 'include') {
                            param.required = false
                        }
                    }
                }
            }
        }
        return spec1
    }
    if (version === 2) {
        return spec2
    }
    return null
}
