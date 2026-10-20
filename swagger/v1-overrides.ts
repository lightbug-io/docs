import { notificationTriggerTypes } from "./v1-enums.js";
// cspell:words urlencode

export const v1SummaryOverrides = {
    'post-users-login': 'Login',
    // points
    'get-devices-id-points-fk': 'Get device point by id',
    'get-devices-id-points': 'Get device points',
    'delete-devices-id-points-fk': 'Delete device point by id',
    // readings
    'get-devices-id-readings-fk': 'Get device reading by id',
    'get-devices-id-readings': 'Get device readings',
    'delete-devices-id-readings-fk': 'Delete device reading by id',
    // device
    'get-devices-id': 'Get device',
    'get-users-id-getDeviceSummary': 'Summary of devices',
    'post-devices-changeTags': 'Change tags for a device',
    // device config stuff
    'get-devices-id-setupSqsForwarding': 'Configure SQS Notifications for a device',
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
    'get-users-id-getRecentActivity': 'Get recent activity for a user'
};

export const v1DescriptionOverrides = {
    'get-devices-id-nearbyDevices': `Returns nearby devices detected by a tracker, including ZeroN devices and BleTag beacons; results are not restricted to BleTag.

Use GET \`https://api.lightbug.cloud/api/devices/{trackerId}/nearbyDevices\`, where \`trackerId\` is the detecting tracker's ID (the \`id\` path parameter). Send your [API token](/apis/authentication) in the \`Authorization\` header.

Supply either a \`correlationId\` from a [location point](/apis/v1/get-devices-id-points) or \`dateRange\`, a JSON array of two Unix-millisecond timestamps. At least one filter is needed: supplying neither returns an empty array. If both are supplied, \`correlationId\` takes precedence.

### Requests

Replace the placeholders with your token, tracker ID and location point's correlation ID. The date range below is illustrative.

\`\`\`sh
curl --get 'https://api.lightbug.cloud/api/devices/TRACKER_ID/nearbyDevices' \\
  --header 'Authorization: YOUR_API_TOKEN' \\
  --data-urlencode 'correlationId=POINT_CORRELATION_ID'

curl --get 'https://api.lightbug.cloud/api/devices/TRACKER_ID/nearbyDevices' \\
  --header 'Authorization: YOUR_API_TOKEN' \\
  --data-urlencode 'dateRange=[1735689600000,1735693200000]'
\`\`\`

### Response

Each array entry contains \`device\` metadata (\`id\`, \`name\`, \`btMac\`, \`ownerId\`, \`tags\`, \`type\`, \`meta\`) and \`readings\` keyed by reading type. Metadata fields can be null or omitted; availability also depends on ownership. Non-BleTag devices are returned only for their owner.

Reading timestamps are Unix milliseconds. For \`ble_seen\`, \`rssi\` is BLE signal strength in dBm and \`value\` mirrors \`rssi\`. The example below is entirely synthetic and illustrates only this reading type.

Date-range results contain the latest reading per nearby device and reading type, not every historical observation. Use [nearbyDeviceData](/apis/v1/get-devices-id-nearbyDeviceData) for a nearby device's time series.

Clients can map detections to their own known fixed beacon locations. This endpoint returns detections; it does not calculate an indoor position.`,
    'get-devices-id-nearbyDeviceData': `Returns readings for one nearby device detected by the specified tracker during a date range.

Use GET \`https://api.lightbug.cloud/api/devices/{trackerId}/nearbyDeviceData\` with your [API token](/apis/authentication) in the \`Authorization\` header. Both \`nearbyId\` (the nearby device's \`device.id\` from [nearbyDevices](/apis/v1/get-devices-id-nearbyDevices)) and \`dateRange\` are required. Encode \`dateRange\` as a JSON array of two Unix-millisecond timestamps.

Replace the placeholders below. The date range is illustrative.

\`\`\`sh
curl --get 'https://api.lightbug.cloud/api/devices/TRACKER_ID/nearbyDeviceData' \\
  --header 'Authorization: YOUR_API_TOKEN' \\
  --data-urlencode 'nearbyId=NEARBY_DEVICE_ID' \\
  --data-urlencode 'dateRange=[1735689600000,1735693200000]'
\`\`\`

The response is an object keyed by reading type, with arrays of \`[timestamp, value]\` pairs ordered by time. Returned timestamps are rounded Unix **seconds**, even though the date-range inputs and nearbyDevices reading timestamps use **milliseconds**. For \`ble_seen\`, the returned value is BLE RSSI in dBm. No matching readings returns \`{}\`.

Synthetic example (BLE detections only):

\`\`\`json
{"ble_seen": [[1735689660, -65], [1735689720, -70]]}
\`\`\``,
    'get-devices-id-points': `Gets one or more points for a device, based on filtering.

### Filter limitations

When filtering by time ranges, using the ` + '`timestamp`' + ` field, you are limited to at most 90 days of data at a time.
If you request more than 90 days, only the latest 90 days in your range will be returned.
A maximum of 10,000 readings can be returned in one request.`,
    'get-devices-id-points-fk': `Get a specific point for device when you already know the device ID and point ID.`,
    'get-users-id-getDeviceSummary': `Lists all devices for a user, with a summary of state, including most resent points.`,
    'get-devices-id-deactivate': `Deactivates a device.`,
    'get-devices-id-activateOnResellerPlan':
`Activates a device on a reseller plan.

This is a special endpoint for resellers to activate a device on a reseller plan.

If you want to activate a device on a modern plan, see the V2 API.`,
    'get-devices-id-readings':
`Gets [readings](/terminology/readings) that a device has taken, such as battery voltage, temperature, humidity etc.

Use [filtering](/apis/v1/filtering) to get a specific [type](/terminology/readings#types).

### Filter limitations

When filtering by time ranges, using the ` + '`timestamp`' + ` field, you are limited to at most 90 days of data at a time.
If you request more than 90 days, only the latest 90 days in your range will be returned.
A maximum of 10,000 readings can be returned in one request.`,
    'get-devices-id-setupSqsForwarding':
`Configure SQS Notifications for a device.

There is a [full guide](/guides/notifications-setup-sqs) written for this endpoint.`,
    'get-users-id-getRecentActivity': 'Gets recent activity for a user, which focuses around notifications that have been triggered.',
};

export const v1Deprecated = [
    'get-devices-id-transients-fk',
];

export const v1ReTag = {
    'post-users-login': 'authentication',
    'put-users-id-geofences-fk': 'geofences',
    'delete-users-id-geofences-fk': 'geofences',
    'post-users-id-geofences': 'geofences',
    'delete-users-id-geofences': 'geofences',
    'get-devices-id-gatewayReadings-fk': 'readings-gateway',
    'delete-devices-id-gatewayReadings-fk': 'readings-gateway',
    'get-devices-id-config': 'device-config',
    'put-devices-id-config': 'device-config',
    'post-devices-id-setSafeZone': 'device-config',
    'get-devices-id-setupSqsForwarding': 'device-config',
    'get-devices-id-setMetaItem': 'device-config',
    'get-devices-id-flightMode': 'device-config',
    'get-devices-id-getSafeZone': 'device-config',
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
    'delete-devices-id-readings-fk': 'readings',
    'get-devices-id-readings-fk': 'readings',
    'get-devices-id-readings': 'readings',
    'get-users-id-getRecentActivity': 'notifications',
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
};

export const v1Removed = [
    'delete-devices-id-gatewayReadings-fk',
    'delete-devices-id-transients-fk',
    'put-devices-id-transients-fk',
    'get-devices-id-transients-fk',
    'get-devices-id-transients',
];

export const V1ParamExamples = {
    'get-devices-id-points': {
        'filter': [
            // TODO unquote / alter these once https://github.com/enzonotario/vitepress-openapi/issues/301 is fixed
            '{"limit":10,"order":["timestamp DESC"]}',
            '{"where":{"timestamp":{"between":["2024-12-01T00:00:00.000Z","2024-12-01T23:59:59.999Z"]}},"order":["timestamp DESC"]}',
            '{"where":{"correlationId":"abc123"}}',
        ],
    },
    'get-devices-id-activateOnResellerPlan': {
        'id': '56892',
        'resellerPlanId': '10',
        'expiry': [Date.now() + (365 * 24 * 60 * 60 * 1000)]
    },
    'get-devices-id-readings': {
        'filter': [
            // TODO unquote / alter these once https://github.com/enzonotario/vitepress-openapi/issues/301 is fixed
            '{"limit":10,"order":["timestamp DESC"]}',
            '{"where":{"type":"temp"},"limit":10,"order":["timestamp DESC"]}',
            '{"where":{"type":"temp","timestamp":{"between":["2024-12-01T00:00:00.000Z","2024-12-01T23:59:59.999Z"]}},"order":["timestamp DESC"]}',
        ],
    },
    'get-devices-id-setupSqsForwarding': {
        'id': 1234,
        'sqsArn': 'arn:aws:sqs:us-east-1:123456789012:my-queue',
        // 'types': [ 'newLoc', 'newReading' ],
    },
    'get-users-id-getRecentActivity': {
        'id': '5678',
        'dateRange': '[1756249200000,1756388711959]',
    },
};

export const V1ResponseExamples = {
    'get-devices-id-nearbyDevices': {
        '200': {
            'application/json': {
                schema: { type: 'array', items: { type: 'object' } },
                examples: { synthetic: { summary: 'Synthetic BLE detections', value: [
                    {
                        device: { id: 1001, name: 'Example ZeroN', btMac: '02:00:00:00:00:01', ownerId: 2001, tags: [], type: 'ZeroN', meta: null },
                        readings: { ble_seen: { timestamp: 1735689660000, value: -65, correlationId: 'example-point-a', rssi: -65 } }
                    },
                    {
                        device: { id: 1002, name: 'Example beacon', btMac: '02:00:00:00:00:02', ownerId: 2001, tags: [], type: 'BleTag', meta: null },
                        readings: { ble_seen: { timestamp: 1735689660000, value: -72, correlationId: 'example-point-a', rssi: -72 } }
                    }
                ] } }
            }
        }
    },
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
    },
    'get-users-id-getRecentActivity': {
        '200': {
            'application/json': {
                schema: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            created: { type: 'string', format: 'date-time' },
                            params: {
                                type: 'object',
                                properties: {
                                    type: {
                                        type: 'string',
                                        enum: notificationTriggerTypes
                                    },
                                    subtype: { type: 'string' },
                                    name: { type: 'string' },
                                    zones: {
                                        type: 'array',
                                        items: { type: 'string' }
                                    },
                                    message: { type: 'string' }
                                }
                            },
                            deviceId: {
                                type: 'number',
                                description: 'The ID of the device that generated this activity.'
                            },
                            pointId: {
                                type: 'number',
                                description: 'Either a datapoint ID or a reading ID, depending on the type of activity.'
                            },
                            triggerId: {
                                type: 'number',
                                description: 'The ID of the notification trigger that caused this activity, if applicable.'
                            }
                        }
                    }
                }
            }
        }
    }
};

export const V1BodyExamples = {
    'post-devices-changeTags': {
        'ids': '[1, 2, 3]',
        'tagEdits': '[{"tag":"test_1:foo","originalTagKey":"test_1"}]',
    }
};

export const V1ParamDescriptions = {
    'get-devices-id-nearbyDevices': {
        'id': 'The detecting tracker ID.',
        'dateRange': 'JSON array [start, end] of Unix-millisecond timestamps. Returns the latest reading per nearby device and reading type. Required unless correlationId is supplied.',
        'correlationId': 'Correlation ID from a tracker location point. Takes precedence over dateRange. Required unless dateRange is supplied.',
    },
    'get-devices-id-nearbyDeviceData': {
        'id': 'The detecting tracker ID.',
        'nearbyId': 'The nearby device ID (device.id from nearbyDevices).',
        'dateRange': 'Required JSON array [start, end] of Unix-millisecond timestamps. Response time-series timestamps use Unix seconds.',
    },
    'get-devices-id-points': {
        'filter': 'Filter criteria for fetching device points.',
    },
    'get-devices-id-activateOnResellerPlan': {
        'id': 'The ID of the device to activate.',
        'resellerPlanId': 'The ID of the reseller plan, which must relate to your reseller account.',
        'expiry': 'The expiry date for the activation in milliseconds since epoch. The device will be deactivated at this time.',
    },
};

export const V1ParamSchemaFormats = {
    'get-devices-id-activateOnResellerPlan': {
        'resellerPlanId': 'integer',
    },
    'get-devices-id-setupSqsForwarding': {
        'types': 'list',
    },
};

export const V1ParamSchemaTypes = {
    'get-devices-id-setupSqsForwarding': {
        'types': 'array',
    },
};

export const V1SchemaPropertyOverrides = {
    'notificationTrigger': {
        'type': {
            enum: notificationTriggerTypes,
        }
    }
};
