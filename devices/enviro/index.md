---
aside: true
---

<script setup>
import loadSpec from '../../utils/loadSpec'
import { ref, onMounted } from 'vue'

const specs = ref(null)

onMounted(async () => {
  const res = await fetch('/device-specs/enviro/v2.yaml')
  const yamlText = await res.text()
  specs.value = loadSpec(yamlText).value
})
</script>

# Enviro (EN2)

<DownloadSpecButton v-if="specs" :spec="specs" deviceTitle="Enviro (EN2)" />

## Images

<DeviceSpecImages v-if="specs" :spec="specs" />

## Overview

<DeviceSpecOverview v-if="specs" :spec="specs" />

## Physical

<DeviceSpecSection v-if="specs" :spec="specs" sectionName="physical" />

## Integrations

<DeviceSpecSection v-if="specs" :spec="specs" sectionName="integrations" />

## User Interface

<DeviceSpecSection v-if="specs" :spec="specs" sectionName="user interface" />

## Connectivity

<DeviceSpecSection v-if="specs" :spec="specs" sectionName="connectivity" />

## Positioning

<DeviceSpecSection v-if="specs" :spec="specs" sectionName="positioning" />

## Sensors

<DeviceSpecSection v-if="specs" :spec="specs" sectionName="sensors" />

## Battery

<DeviceSpecSection v-if="specs" :spec="specs" sectionName="battery" />

## Charging

<DeviceSpecSection v-if="specs" :spec="specs" sectionName="charging" />

## Components

<DeviceSpecSection v-if="specs" :spec="specs" sectionName="components" />

## Specification

| Attribute             | Value                                                                                        |
| --------------------- | -------------------------------------------------------------------------------------------- |
| Device                | EN2                                                                                          |
| Size                  | 85 x 44 x 28.4 mm                                                                            |
| Weight                | 152g                                                                                         |
| Battery               | 6600mAh (Rechargeable Lithium)                                                                |
| Sim                   | Integrated roaming sim                                                                       |
| GSM                   | Quadband 4G LTE-M & NBIoT + 2G fallback                                                               |
| Bluetooth             | 5.0                                                                                          |
| Positioning           | GPS (GPS, GLONASS, BEIDOU, GALILEO & QZSS), WiFi & GSM                                       |
| Sensors               | High accuracy Temperature & Humidity Sensors, Orientation, Accelerometer, External Bluetooth |
| Memory                | up to 1000 locations update when they can't be transmitted                                   |
| IP rating             | Shockproof                                                                                   |
| Operating Temperature | -20°C to 60°C ¹                                                                              |
| Buttons               | 1                                                                                            |
| LEDs                  | 6 (4x battery, 2x status)                                                                    |
| Sound                 | Buzzer                                                                                       |
| Charging              | Magnetic 4 pin connector                                                                     |
| Additional            |                                                                                              |
| Typical Usage         | For tracking temperature & humidity sensitive non powered assets                                                                                         |
| Optional              | NFC                                                                                          |

<small>¹ All device batteries can be [customized](/devices/custom) down to -40°C with other tradeoffs, please contact us for more information.</small>

## Charging

The Pro tracker is charged using a magnetic 4 pin connector, and should be charged for 5 hours before initial use.

This connecter can be used with a magnetic cable or a pro charging dock.

<!-- TODO side by side picture of 2 charging methods -->

| State                    | Indication                                                                   |
| ------------------------ | ---------------------------------------------------------------------------- |
| Disconnected             | No LEDs will be on                                                           |
| Connected, Charging      | Battery LEDs display the charge of the device, and will blink while charging |
| Connected, Fully charged | Battery LEDs display the charge of the device, no blinking will happen       |

::: warning
It is advised to use an adapter plugged into a power socket rather than using a computer USB port or similar.
:::
