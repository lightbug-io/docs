import spec1 from '../public/swagger/v1.json' with { type: 'json' }
import spec2 from '../public/swagger/v2.json' with { type: 'json' }

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
    'post-devices-changeTags': 'Change tags for a device',

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
    'get-devices-id-points': 'Gets one or more points for a device, based on filtering.',
    'get-devices-id-points-fk': 'Get a specific point for device when you already know the device ID and point ID.',
    'get-users-id-getMqttCredentials': 'Retrieves a users MQTT Credentials if set, for legacy use in connecting to MQTT.',
    'get-users-id-getDeviceSummary': 'Lists all devices for a user, with a summary of state, including most resent points.',
}

const v1Deprecated = [
    'get-devices-id-transients-fk',
]

const v1ReTag = {
    'post-users-login': 'authentication',

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

    'get-devices-id-messages': 'device-misc',
    'post-devices-id-messages': 'device-misc',
    'delete-devices-id-messages': 'device-misc',
    'get-devices-id-transients': 'device-misc',
    'get-devices-id-transients-fk': 'device-misc',
    'get-devices-id-nearbyDevices': 'device-misc',
    'get-devices-id-nearbyDeviceData': 'device-misc',

    'get-devices-id-getRtkStatus': 'rtk',
    'get-devices-id-getRecentRtkLogs': 'rtk',
    'get-devices-id-getRtkCommand': 'rtk',
    'get-devices-id-queueRtkCmd-UpdateRateMs': 'rtk',
    'get-devices-id-queueRtkCmd-AlertNow': 'rtk',
    'get-devices-id-queueRtkCmd-AlertWithPrompt': 'rtk',
    'get-devices-id-queueRtkCmd-RebootRtk': 'rtk',
    'get-devices-id-queueRtkCmd-SetPointBufferSize': 'rtk',
    'get-devices-id-updateRtkBaseStatus': 'rtk',

    'get-devices-id': 'device',
    'get-users-id-devices': 'device',
    'get-users-id-getDeviceSummary': 'device',
    'get-users-id-getDevicesInZone': 'device',
    'get-users-id-getDevicesByTag': 'device',

    'get-devices-id-points-fk': 'points',
    'get-devices-id-points': 'points',
    'delete-devices-id-points-fk': 'points',

    'get-devices-id-readings-fk': 'readings',
    'get-devices-id-readings': 'readings',
    'put-devices-id-gatewayReadings-fk': 'readings',

    'get-devices-id-notificationTriggers-fk': 'notifications',
    'delete-devices-id-notificationTriggers-fk': 'notifications',
    'put-devices-id-notificationTriggers-fk': 'notifications',
    'get-devices-id-notificationTriggers': 'notifications',
    'post-devices-id-notificationTriggers': 'notifications',
    'delete-devices-id-notificationTriggers': 'notifications',

    'get-users-id-geofences': 'geofences',
    'get-users-id-geofences-fk': 'geofences',

}

const v1Removed = [
    // At the time of writing the new docs site, this endpoint had been removed
    'delete-devices-id-gatewayReadings-fk',
    'delete-devices-id-transients-fk',
    'put-devices-id-transients-fk',
    'get-devices-id-transients-fk',
]

const V1ParamExamples = {
    'get-devices-id-points': {
        // 'filter': '{"limit":10,"order":["timestamp DESC"],"where":{"between":["2024-12-01T00:00:00.000Z","2024-12-31T23:59:59.999Z"]}}',
        'filter': '{"limit":10,"order":["timestamp DESC"]}',
    },
}

const V1BodyExamples = {
    'post-devices-changeTags': {
        'ids': '[1, 2, 3]',
        'tagEdits': '[{"tag":"test_1:foo","originalTagKey":"test_1"}]',
    }
}

export function loadSpec(version: number): any {
    if (version === 1) {
        spec1.paths = normalizePaths(spec1.paths)

        // override stuff
        for (const path of Object.keys(spec1.paths)) {
            for (const method of Object.keys(spec1.paths[path])) {
                // opertaionId is method-path (with / replaced with -)
                let operationId = method + path.replace(/\//g, '-')
                // Replace _ with -
                operationId = operationId.replace(/_/g, '-')
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
                if (operationId in v1ReTag) {
                    spec1.paths[path][method].tags = [v1ReTag[operationId]]
                } else {
                    console.log('No re-tag for', operationId)
                }
                if (operationId in V1ParamExamples) {
                    for (const param of spec1.paths[path][method].parameters) {
                        if (param.name in V1ParamExamples[operationId]) {
                            param.example = V1ParamExamples[operationId][param.name]
                        }
                    }
                }
                if (operationId in V1BodyExamples) {
                    if (spec1.paths[path][method].requestBody) {
                        for (const content of Object.keys(spec1.paths[path][method].requestBody.content)) {
                            for (const prop of Object.keys(spec1.paths[path][method].requestBody.content[content].schema.properties)) {
                                if (prop in V1BodyExamples[operationId]) {
                                    spec1.paths[path][method].requestBody.content[content].schema.properties[prop].example = V1BodyExamples[operationId][prop]
                                }
                            }
                        }
                    }
                }

                if (operationId in v1Deprecated) {
                    spec1.paths[path][method].deprecated = true
                    // Until this is actually rendered, also prefix the summary with "Deprecated"
                    spec1.paths[path][method].summary = `Deprecated: ${spec1.paths[path][method].summary}`
                    // and the description
                    spec1.paths[path][method].description = `This endpoint is deprecated. ${spec1.paths[path][method].description}`
                }
                // If a method has a parameter called include, then it is never required...
                if (spec1.paths[path][method].parameters) {
                    for (const param of spec1.paths[path][method].parameters) {
                        if (param.name === 'include') {
                            param.required = false
                        }
                    }
                }
                // Remove RTK> from all
                if (spec1.paths[path][method].summary) {
                    spec1.paths[path][method].summary = spec1.paths[path][method].summary.replace('RTK>', '')
                }
                if (spec1.paths[path][method].description) {
                    spec1.paths[path][method].description = spec1.paths[path][method].description.replace('RTK>', '')
                }

                // Remove everything except application/json from them all
                if (spec1.paths[path][method].responses) {
                    for (const response of Object.keys(spec1.paths[path][method].responses)) {
                        if (response === '200' && spec1.paths[path][method].responses[response].content) {
                            const content = spec1.paths[path][method].responses[response].content
                            for (const type of Object.keys(content)) {
                                if (type !== 'application/json') {
                                    delete content[type]
                                }
                            }
                        } else {
                            delete spec1.paths[path][method].responses[response]
                        }
                    }
                }
            }
        }
        return spec1
    }
    if (version === 2) {
        spec2.paths = normalizePaths(spec2.paths)
        return spec2
    }
    return null
}

// Normalize paths by removing { and } from the path
function normalizePaths(paths: any) {
    for (const path of Object.keys(paths)) {
        // Remove { and } from the path
        const pathName = path.replace(/{/g, '').replace(/}/g, '')
        if (pathName === path) {
            continue // No change
        }
        // Replace the path with the new path
        paths[pathName] = paths[path]
        // Remove the old path
        delete paths[path]
    }
    return paths
}
