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

## Capabilities

- [Four power LEDs](/devices/capabilities/four-power-leds), with the VT3 connection display described below. Do not apply the older GPS/GSM colour table or RH2 RGB charging table to these indicators.

## Vehicle connection status

After showing battery status, a short status-button press shows ignition and charging information in **five brief flash cycles**, about 0.3 seconds on and 0.2 seconds off:

| Indicator pair | Flashes when |
| --- | --- |
| 1 and 2 | The device detects ignition high |
| 3 and 4 | The device reports that it is charging |

Both pairs can flash when both conditions are true. These are logical indicator numbers, not a left-to-right enclosure diagram. The diagram below does not assert the physical colour or orientation for a hardware revision.

![Vehicle connection pattern: indicators 1 and 2 flash for ignition high, indicators 3 and 4 for charging, and all four for both. Five cycles, about 0.3 seconds on and 0.2 seconds off. Neutral shading indicates on and is not an LED colour.](/images/devices/general/led-vehicle-status.svg)

The display can also appear when charging starts or ignition becomes high. Paired flashing can therefore be normal. External power does not always mean the battery is currently charging, so an unlit charging pair alone is not proof of a wiring fault.

Follow the [installation checks](/devices/vehicle/installation#step-8-check-functionality) and confirm the reported external-power and ignition state where available. If those readings do not match the wiring, ask support before changing the installation.


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
