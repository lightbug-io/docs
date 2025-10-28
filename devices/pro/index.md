---
aside: true
---

<script setup>
import spec from '../../public/device-specs/pro/v2.yaml?raw'
import loadSpec from '../../utils/loadSpec'

const specs = loadSpec(spec)
</script>

# Pro (PR2)

<DownloadSpecButton :spec="specs" deviceTitle="Pro (PR2)" />

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

The Pro tracker is charged using a USB-C connector, and should be charged for 8 hours before initial use.

| State | Indication |
|---|---|
| Disconnected | No LED will be on |
| Connected, Charging | LED will pulse red |
| Connected, Fully charged | LED will be solid green |

::: warning
It is advised to use an adapter plugged into a power socket rather than using a computer USB port or similar.
:::
