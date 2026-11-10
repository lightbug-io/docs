---
aside: true
---

<script setup>
import spec from '../../public/device-specs/pro/v2.yaml?raw'
import loadSpec from '../../utils/loadSpec'

const specs = loadSpec(spec)
</script>

# PR2 (ProN) {#pro-pr2}

::: info Legacy device
ProN (PR2) is no longer in production. This page and its specification download remain available for existing devices. For the newer generation, use the [Pro3 (PR3) page](/devices/pro/).
:::

## Choose your Pro generation

The Pro family includes different hardware generations. **The specifications and images on this page are for ProN (PR2), device ID prefix 20.**

| Your device | Where to start |
| --- | --- |
| ProN / Pro PR2 | Continue on this page. This model has four battery indicators and two separate GPS/mobile-network indicators. |
| Pro3 / PR3 | Use the [Pro3 device page](/devices/pro/). This model has four power indicators and different electronics. |

If you are unsure which model you have, check its product code or ask [support](https://lightbug.io/contact/) with the device ID. Do not choose a guide from the name “Pro” alone.

<DownloadSpecButton :spec="specs" deviceTitle="ProN (PR2)" />

## Feature guides {#capabilities}

<DeviceCapabilities device="PR2" />

Use the [LED guide](/guides/leds) to interpret a pattern in context. The PR2 startup example is below.

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

On ProN/PR2, the battery lights show the charge level and the highest lit battery light blinks while charging below about 95%. At higher charge levels, the normal display becomes steady. See [four power LED charging patterns](/devices/capabilities/four-power-leds#charging).

When unplugged and resting, the lights normally go out, but a button press, restart or other device activity can still light them.

::: warning
It is advised to use an adapter plugged into a power socket rather than using a computer USB port or similar.
:::

## Two red lights and four orange lights after a restart

::: tip This can be normal
On a Pro PR2, two red status lights together with all four orange battery lights can appear during a restart. This pattern alone does not mean that the tracker is faulty, or that its battery is full.
:::

![Six-indicator restart example: four orange battery lights on the left, followed by red GPS and mobile-network lights. The diagram labels every light and is not a fault code.](/images/devices/general/led-restart.svg)

The tracker can restart automatically as well as after a reset. Startup lights may change or run across the battery indicators before the normal status display returns. The exact sequence depends on the hardware, firmware and reason for the restart.

**What should I do?**

1. Let the tracker finish starting and give it a couple of minutes to communicate.
2. Check its latest communication or update time in the app or web portal. A recent successful update is more useful than a snapshot of the lights. An old location on the map does not by itself show whether the tracker has just communicated.
3. If updates do not resume, check the charge, data plan and mobile coverage. For a GPS test, place it outside with a clear view of the sky.

If the same pattern persists, keeps returning, or the tracker is not communicating, [contact support](https://lightbug.io/contact/). Include the device ID, when you saw it, whether it was on charge, its last update time, and a short video showing whether the lights are steady or flashing.
