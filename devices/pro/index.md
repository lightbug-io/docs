---
aside: true
---

<script setup>
import spec from '../../public/device-specs/pro/v2.yaml?raw'
import loadSpec from '../../utils/loadSpec'

const specs = loadSpec(spec)
</script>

# ProN (PR2) {#pro-pr2}

::: info Legacy device
ProN (PR2) is no longer in production. This page and its specification download remain available for existing devices. For the newer generation, use the [Pro3 (PR3) page](/devices/pro/pro3).
:::

## Choose your Pro generation

The Pro family includes different hardware generations. **The specifications and images on this page are for ProN (PR2), device ID prefix 20.**

| Your device | Where to start |
| --- | --- |
| ProN / Pro PR2 | Continue on this page. This model has four battery indicators and two separate GPS/mobile-network indicators. |
| Pro3 / PR3 | Use the [Pro3 device page](/devices/pro/pro3). Revisions 02–04 have four orange indicators and different electronics. |

If you are unsure which model you have, check its product code or ask [support](https://lightbug.io/contact/) with the device ID. Do not choose a guide from the name “Pro” alone.

<DownloadSpecButton :spec="specs" deviceTitle="ProN (PR2)" />

::: tip LED help
For this ProN/PR2 model, see the [model-specific LED guide](/guides/tracker-leds), including [two red and four orange lights after a restart](/guides/tracker-leds#two-red-lights-and-four-orange-lights-after-a-restart). The separate [Pro3 LED guide](/guides/pro3-leds) does not use this six-indicator layout.
:::

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

## Additional Charging Information

Use the charging accessory supplied for your ProN/PR2 and a suitable power adapter. The connector on the power adapter or cable is not necessarily the connector on the tracker. Check the battery level and normal charging display rather than relying on a fixed initial charging time.

On ProN/PR2, the battery lights show the charge level and the highest lit battery light blinks while charging below about 95%. At higher charge levels, the normal display becomes steady. See [charging patterns](/guides/tracker-leds#charging-patterns).

When unplugged and resting, the lights normally go out, but a button press, restart or other device activity can still light them.

::: warning
It is advised to use an adapter plugged into a power socket rather than using a computer USB port or similar.
:::
