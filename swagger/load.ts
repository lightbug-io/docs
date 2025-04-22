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

    // TODO notification triggers should probably render in swagger with better names
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

    'get-devices-id-deactivate': 'Deactivate device',
    'get-devices-id-activateOnResellerPlan': 'Activate device on reseller plan',

    'get-devices-id-setNtripSettings': 'Set the NTRIP settings for a device.',

    'post-reports-activity': 'Device Activity',
    'post-reports-vehicle-summary': 'Vehicle Summary',
}

const v1DescriptionOverrides = {
    'get-devices-id-points': 'Gets one or more points for a device, based on filtering.',
    'get-devices-id-points-fk': 'Get a specific point for device when you already know the device ID and point ID.',
    'get-users-id-getMqttCredentials': 'Retrieves a users MQTT Credentials if set, for legacy use in connecting to MQTT.',
    'get-users-id-getDeviceSummary': 'Lists all devices for a user, with a summary of state, including most resent points.',
    'get-devices-id-deactivate': 'Deactivates a device.',
    'get-devices-id-activateOnResellerPlan': 'Activates a device on a reseller plan.\n\nThis is a special endpoint for resellers to activate a device on a reseller plan.\n\nIf you want to activate a device on a modern plan, see the V2 API.',
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

    // Split out device activation too
    'get-devices-id-deactivate': 'device-activation',
    'get-devices-id-activateOnResellerPlan': 'device-activation',

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
    'get-devices-id-setNtripSettings': 'rtk',

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

    'post-reports-activity': 'reports',
    'post-reports-vehicle-summary': 'reports',
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
        'filter': [
            '{"limit":10,"order":["timestamp DESC"]}',
            '{"where":{"between":["2024-12-01T00:00:00.000Z","2024-12-01T23:59:59.999Z"]},"order":["timestamp DESC"]}',
        ],
    },
    'get-devices-id-activateOnResellerPlan': {
        'id': '56892',
        'resellerPlanId': '10',
        'expiry': [Date.now() + (365 * 24 * 60 * 60 * 1000)]
    },
}

const V1ResponseExamples = {
    'get-users-id-getDeviceSummary': {
        '200': {
            'application/json': {
                'schema': {
                    'type': 'array',
                    'items': {
                        'type': 'object',
                        'properties': {
                            'id': { 'type': 'number' },
                            'name': { 'type': 'string' },
                            'serial': { 'type': 'string' },
                            'type': { 'type': 'string' },
                            'latestPoints': {
                                'type': 'array',
                                'items': {
                                    'type': 'object',
                                    'properties': {
                                        'location': {
                                            'type': 'object',
                                            'properties': {
                                                'lng': { 'type': 'number' },
                                                'lat': { 'type': 'number' }
                                            }
                                        },
                                        'timestamp': { 'type': 'string', 'format': 'date-time' },
                                        'speed': { 'type': ['number', 'null'] },
                                        'altitude': { 'type': ['number', 'null'] },
                                        'course': { 'type': ['number', 'null'] },
                                        'sendReason': { 'type': 'number' },
                                        'accuracy': { 'type': 'number' },
                                        'locationType': { 'type': 'string' },
                                        'averageCharge': { 'type': ['number', 'null'] },
                                        'created': { 'type': 'string', 'format': 'date-time' },
                                        'address': { 'type': 'string' },
                                        'alertType': { 'type': ['string', 'null'] },
                                        'gsmSignal': { 'type': 'number' },
                                        'correlationId': { 'type': 'string' },
                                        'id': { 'type': 'number' },
                                        'deviceId': { 'type': 'number' }
                                    }
                                }
                            },
                            'config': { 'type': 'object' },
                            'subscription': { 'type': 'object' }
                        }
                    }
                }
            }
        }
    },
    'post-reports-activity': {
        '200': {
            'application/json': {
                'schema': {
                    'type': 'object',
                    'properties': {
                        'off': {
                            'type': 'object',
                            'properties': {
                                'time': { 'type': 'number' },
                                'distance': { 'type': 'number' }
                            }
                        },
                        'idle': {
                            'type': 'object',
                            'properties': {
                                'time': { 'type': 'number' },
                                'distance': { 'type': 'number' }
                            }
                        },
                        'movingWithIgnitionOn': {
                            'type': 'object',
                            'properties': {
                                'time': { 'type': 'number' },
                                'distance': { 'type': 'number' }
                            }
                        },
                        'movingWithIgnitionOff': {
                            'type': 'object',
                            'properties': {
                                'time': { 'type': 'number' },
                                'distance': { 'type': 'number' }
                            }
                        },
                        'log': {
                            'type': 'array',
                            'items': { 'type': 'object' }
                        }
                    }
                }
            }
        }
    },
    'post-reports-vehicle-summary': {
        '200': {
            'application/json': {
                'schema': {
                    'type': 'object',
                    'properties': {
                        'numTrips': { 'type': 'number' },
                        'totalDist': { 'type': 'number' },
                        'totalTime': { 'type': 'number' },
                        'avgDist': { 'type': ['number', 'null'] },
                        'avgTime': { 'type': ['number', 'null'] },
                        'idleTime': {
                            'type': 'object',
                            'properties': {
                                'total': { 'type': 'number' },
                                'inWork': { 'type': 'number' },
                                'inMaintenance': { 'type': 'number' }
                            }
                        },
                        'distances': {
                            'type': 'object',
                            'properties': {
                                'total': { 'type': 'number' },
                                'inWork': { 'type': 'number' },
                                'inMaintenance': { 'type': 'number' }
                            }
                        },
                        'ignitionTime': { 'type': ['number', 'null'] },
                        'movingTime': {
                            'type': 'object',
                            'properties': {
                                'total': { 'type': 'number' },
                                'inWork': { 'type': 'number' },
                                'inMaintenance': { 'type': 'number' }
                            }
                        },
                        'workTime': { 'type': 'number' },
                        'maintenanceTime': { 'type': 'number' },
                        'offTimes': {
                            'type': 'object',
                            'properties': {
                                'total': { 'type': 'number' },
                                'inWork': { 'type': 'number' },
                                'inMaintenance': { 'type': 'number' }
                            }
                        }
                    }
                }
            }
        }
    }
}

const V1BodyExamples = {
    'post-devices-changeTags': {
        'ids': '[1, 2, 3]',
        'tagEdits': '[{"tag":"test_1:foo","originalTagKey":"test_1"}]',
    }
}

const V1ParamDescriptions = {
    'get-devices-id-points': {
        'filter': 'Filter criteria for fetching device points.',
    },
    'get-devices-id-activateOnResellerPlan': {
        'id': 'The ID of the device to activate.',
        'resellerPlanId': 'The ID of the reseller plan, which must relate to your reseller account.',
        'expiry': 'The expiry date for the activation in milliseconds since epoch. The device will be deactivated at this time.',
    },
}

const V1ParamSchemaFormats = {
    'get-devices-id-activateOnResellerPlan': {
        'resellerPlanId': 'integer',
    },
}

export function loadSpec(version: number): any {
    if (version === 1) {
        // Add auth modes to v1
        // "securitySchemes": {
        //     "ApiKeyAuth": {
        //       "in": "header",
        //       "name": "Authorization",
        //       "type": "apiKey"
        //     }
        //   }
        (spec1.components as any).securitySchemes = {
            ApiKeyAuth: {
                in: 'header',
                name: 'Authorization',
                type: 'apiKey'
            }
        }
        // And add the security to the endpoints (everything except things with "login" in them)
        for (const path of Object.keys(spec1.paths)) {
            for (const method of Object.keys(spec1.paths[path])) {
                if (!path.includes('login')) {
                    spec1.paths[path][method].security = [{ ApiKeyAuth: [] }]
                }
            }
        }

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
                }
                if (operationId in V1ParamExamples) {
                    for (const param of spec1.paths[path][method].parameters) {
                        if (param.name in V1ParamExamples[operationId]) {
                            param.example = V1ParamExamples[operationId][param.name]
                        }
                    }
                }
                if (operationId in V1ResponseExamples) {
                    for (const response of Object.keys(spec1.paths[path][method].responses)) {
                        if (response in V1ResponseExamples[operationId]) {
                            spec1.paths[path][method].responses[response].content = V1ResponseExamples[operationId][response]
                        }
                    }
                }
                if (operationId in V1ParamDescriptions) {
                    for (const param of spec1.paths[path][method].parameters) {
                        if (param.name in V1ParamDescriptions[operationId]) {
                            param.description = V1ParamDescriptions[operationId][param.name]
                        }
                    }
                }
                if (operationId in V1ParamSchemaFormats) {
                    for (const param of spec1.paths[path][method].parameters) {
                        if (param.name in V1ParamSchemaFormats[operationId]) {
                            param.schema.format = V1ParamSchemaFormats[operationId][param.name]
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

                // Make sure that all schemas have "type": "object", if they don't have another type defined
                if (spec1.components.schemas) {
                    for (const schema of Object.keys(spec1.components.schemas)) {
                        if (!spec1.components.schemas[schema].type) {
                            spec1.components.schemas[schema].type = 'object'
                        }
                    }
                }
            }
        }
        return spec1
    }
    if (version === 2) {
        // Remove any servers that include "localhost"
        if (spec2.servers) {
            spec2.servers = spec2.servers.filter((server: any) => !server.url.includes('localhost'))
        }
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
