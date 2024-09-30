---
aside: true
outline: [2,3]
---
<script setup>
import BitfieldCalculator from '../../components/BitfieldCalculator.vue'
</script>

# Glossary

The version 1 API uses a number of terms that may not be familiar to all users.

## Points

General infomation about points can be found [in the basics section](/basics/points.html).

### sendReason

`sendReason` is a field that is attached to every point that is sent from the device to the server.

In the V1 API it is a bitfield, meaning that it can have multiple values set at once.

::: info <v-icon icon="mdi-calculator-variant-outline"></v-icon> Use this calculator to determine what any sendReason values mean.
<hr>
<BitfieldCalculator :bitfieldDescriptions="[
    'Wake mode active',
    'Sleep mode active',
    'Bluetooth disconnected',
    'Outside of Safe-zone',
    'Motion detected',
    'Device started moving',
    'Device stopped moving',
    'Position is stale: last known location was used'
]" />
:::

### alertType

`alertType` is a field that is attached to every point that is sent from the device to the server.

In the V1 API it is a bitfield, meaning that it can have multiple values set at once.

::: info <v-icon icon="mdi-calculator-variant-outline"></v-icon> Use this calculator to determine what any alertType values mean.
<hr>
<BitfieldCalculator :bitfieldDescriptions="[
    'MotionThreshold',
    'Rotation',
    'Jamming',
    'Button',
    'POI',
    'Ignition'
]" />
:::

### ErrorCode

Points can have device error codes attached to them.

In the V1 API these are represented as a positive integer value, up to a maximum of 255, but are not a bitfield.

These are stored in the `stringValue` field that is accessbile via the API.

| Error Code | Description |
|------------|-------------|
| 13         | TX too long ago |
| 30         | system severe error |
| 31         | hard fault |
| 32         | GSM no network |
| 33         | GSM denied |
| 34         | **GPS lock fail**: Indicates that the device failed to acquire a GPS lock within the GPS timeout period. |
| 35         | **GPS lock skipped**: Indicates that the device has not moved since it last got (or attempted to get and failed) a GPS lock. This is not an error, this is a power saving measure indicating the device didn't bother turning on GPS. As soon as any motion is detected or 24 hours passes the flag is cleared and GPS turns on again. Almost always this is a good thing but if you'd like to disable it you can do so from the advanced settings (disable gps optimisation). |
| 36         | RTCM watchdog |
| 251        | too much power |
| 252        | button reset |
| 253        | health reset |
| 254        | wake from deep sleep |
| 255        | deliberate reset |

Some error codes are less useful for end users:

::: details Less useful error codes

| Error Code | Description |
|------------|-------------|
| 0          | no error    |
| 1          | server error |
| 2          | bluetooth error |
| 3          | encryption not initialised |
| 4          | corrupt pointers |
| 5          | GPS init failed |
| 6          | failed to exit EPO |
| 7          | server error exceeded |
| 8          | no SIM |
| 9          | generic init failed |
| 10         | out of memory |
| 11         | own watchdog |
| 12         | RTC died |
| 14         | GSM locked up |
| 15         | jumped to zero |
| 16         | pins bad |
| 17         | MPU init failed |
| 18         | encryption failed |
| 19         | sensor too large |
| 20         | system error |
| 21         | EEPROM error |
| 22         | I2C error |
:::

## Device Settings

Some settings that are exposed via API v1 are exposed as bitfields.

### behaviour

behaviour is a bitfield, meaning that it can have multiple values set at once.

::: info <v-icon icon="mdi-calculator-variant-outline"></v-icon> Use this calculator to determine what any behaviour values mean.
<hr>
<BitfieldCalculator :bitfieldDescriptions="[
    'GsmOnWhenAwake',
    'GsmOnWhenAsleep',
    'GpsOnWhenAwake',
    'DisableWifiAccuracyAssist',
    'RepeatSleep',
    'DisableBluetooth',
    'DisableWifi',
    'SmartGps'
]" />
:::

::: warning
DisableBluetooth & DisableWifi require a device reset to take effect.
:::

### modeControl

::: info <v-icon icon="mdi-calculator-variant-outline"></v-icon> Use this calculator to determine what any modeControl values mean.
<hr>
<BitfieldCalculator :bitfieldDescriptions="[
    'StartStopOnly',
    'LockAwakeOnAlert',
    'SendSleepLocAfterBtDisconnect',
    'PeriodicBtRefreshDisabled',
    'batchTransmitOnCheckIn',
    'disableGPS',
    'ButtonOnOff',
    'AlwaysOn'
]" />
:::

### modeControl2

::: info <v-icon icon="mdi-calculator-variant-outline"></v-icon> Use this calculator to determine what any modeControl2 values mean.
<hr>
<BitfieldCalculator :bitfieldDescriptions="[
    'SendStopImmediately',
    'StopTimeoutIsInMinutes',
    'HarshPowerBudget',
    'Lock2G',
    'DisableGpsOptimisations',
    'EnableShockDetect',
    'UwbBroadcasting',
    'UwbScanning'
]" />
:::
