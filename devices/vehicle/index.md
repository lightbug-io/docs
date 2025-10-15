---
aside: true
next:
  text: 'Installation'
  link: '/devices/vehicle/installation'
---

<script setup>
import spec from '../../public/device-specs/vehicle/v3.yaml?raw'
import loadSpec from '../../utils/loadSpec'

const specs = loadSpec(spec)
</script>

# Vehicle (VT3)

<DownloadSpecButton :spec="specs" deviceTitle="Vehicle (VT3)" />

## Images

<DeviceSpecImages :spec="specs" />

## Overview

<DeviceSpecOverview :spec="specs" />

<template v-if="specs.physical">

## Physical

<DeviceSpecSection :spec="specs" sectionName="physical" />

</template>

<template v-if="specs.integrations">

## Integrations

<DeviceSpecSection :spec="specs" sectionName="integrations" />

</template>

<template v-if="specs['user interface']">

## User Interface

<DeviceSpecSection :spec="specs" sectionName="user interface" />

</template>

<template v-if="specs.connectivity">

## Connectivity

<DeviceSpecSection :spec="specs" sectionName="connectivity" />

</template>

<template v-if="specs.positioning">

## Positioning

<DeviceSpecSection :spec="specs" sectionName="positioning" />

</template>

<template v-if="specs.sensors">

## Sensors

<DeviceSpecSection :spec="specs" sectionName="sensors" />

</template>

<template v-if="specs.battery">

## Battery

<DeviceSpecSection :spec="specs" sectionName="battery" />

</template>

<template v-if="specs.charging">

## Charging

<DeviceSpecSection :spec="specs" sectionName="charging" />

</template>

<template v-if="specs.components">

## Components

<DeviceSpecSection :spec="specs" sectionName="components" />

</template>

## Specification

| Attribute             | Value                                                                          |
| --------------------- | ------------------------------------------------------------------------------ |
| Device                | VT3                                                                            |
| First produced        | 2024 |
| Size                  | 96 x 75 x 26 mm                                                                |
| Weight                | 142-180g (depending on battery configuration) + 36g cable                      |
| Battery               | 1x 2000mah mAh (Rechargeable), Room to double capacity                          |
| Sim                   | Integrated roaming sim                                                         |
| GSM                   | 4G LTE CAT-1 Global Operation (850/900/1800/1900MHz integ. antenna), 2G GPRS Fallback |
| Bluetooth             | 5.0                                                                            |
| Positioning           | GPS (GPS, GLONASS, BEIDOU, GALILEO & QZSS) 18mm Patch antenna & GSM                         |
| Sensors               | Temperature, Orientation, Accelerometer, External Bluetooth, Voltage, Ignition |
| Memory                | up to 1000 locations update when they can't be transmitted                     |
| IP rating             | IP66 Waterproof & Shockproof                                                   |
| Operating Temperature | 0°C to 60°C ¹                                                                  |
| Buttons               | 1                                                                              |
| LEDs                  | 4                                                                              |
| Sound                 | None                                                                           |
| Power                 | Supports 6-60v DC (overvoltage protection to 200v), via 3 pin connector        |
| Additional            | Configurable maximum power draw                                                |
| Typical Usage         | Tracking of powered assets                                                     |

<small>¹ All device batteries can be [customized](/devices/custom) down to -40°C with other tradeoffs, please contact us for more information.</small>
