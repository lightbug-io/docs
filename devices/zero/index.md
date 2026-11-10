---
aside: true
---

<script setup>
import spec from '../../public/device-specs/zero/v2.yaml?raw'
import loadSpec from '../../utils/loadSpec'

const specs = loadSpec(spec)
</script>

# Zero (ZE2)

<DownloadSpecButton :spec="specs" deviceTitle="Zero (ZE2)" />

## Feature guides {#capabilities}

<DeviceCapabilities device="ZE2" />

This page covers ZE2; use the model and revision when following the [LED guide](/guides/leds).

## Images

<DeviceSpecImages :spec="specs" />

## Overview

<DeviceSpecOverview :spec="specs" />

<template v-if="specs.product.physical">

## Physical

<DeviceSpecSection :spec="specs" sectionName="physical" />

</template>

<template v-if="specs.product.integrations">

## Integrations

<DeviceSpecSection :spec="specs" sectionName="integrations" />

</template>

<template v-if="specs.product['user interface']">

## User Interface

<DeviceSpecSection :spec="specs" sectionName="user interface" />

</template>

<template v-if="specs.product.connectivity">

## Connectivity

<DeviceSpecSection :spec="specs" sectionName="connectivity" />

</template>

<template v-if="specs.product.positioning">

## Positioning

<DeviceSpecSection :spec="specs" sectionName="positioning" />

</template>

<template v-if="specs.product.sensors">

## Sensors

<DeviceSpecSection :spec="specs" sectionName="sensors" />

</template>

<template v-if="specs.product.battery">

## Battery

<DeviceSpecSection :spec="specs" sectionName="battery" />

</template>

<template v-if="specs.product.charging">

## Charging

<DeviceSpecSection :spec="specs" sectionName="charging" />

</template>

<template v-if="specs.product.components">

## Components

<DeviceSpecSection :spec="specs" sectionName="components" />

</template>

## Exterior

<img src="/images/devices/zero/overview.png" style="max-height: 300px; max-width: 300px">
<img src="/images/devices/zero/leds.png" style="max-height: 300px; max-width: 300px">

## LED Indicators

The six indicators are four battery lights, one GPS light and one mobile-network light. Use the icons above the lights to identify them.

The [four power LED capability](/devices/capabilities/four-power-leds) defines the battery and charging patterns. The [GPS/GSM status capability](/devices/capabilities/gps-gsm-status-leds#zero-ze2) describes the diagnostic pair and its colour caveats. Startup lights are not a battery reading.

## Buttons

The device has a single button that can be used to trigger different events.

| Trigger    | Indication | Event                                                                                                                                      | Details |
| ---------- | ------|------------------------------------------------------------------------------------------------------------------------------------ | -- |
|  < 1 second | Battery and status LEDs will light up | | Shows you current status |
| 1-3 second | The battery LEDs will flash from left to right in a cycle, and you will hear a small beep. | Send button press event & location | Initially sending an immediate location, followed by a more accurate location once found.
| 15 second | The battery LEDs may go blank for a second, but then will flash from left to right in a cycle, and you will hear a small beep. | Hard reset | Recommended if you are experiencing network related performance issues |

## Charging

The Zero tracker is charged using a magnetic 4 pin connector, and should be charged for 3 hours before initial use.

This connecter can be used with a magnetic cable or a zero charging dock.

<!-- TODO side by side picture of 2 charging methods -->

For six-indicator models, the battery lights show the charge level and the highest lit battery light blinks while charging below about 95%. At higher charge levels, the normal display becomes steady. See [four power LED charging patterns](/devices/capabilities/four-power-leds#charging).

When unplugged and resting, the lights normally go out, but a button press, restart or other device activity can still light them.

::: warning
It is advised to use an adapter plugged into a power socket rather than using a computer USB port or similar.
:::
