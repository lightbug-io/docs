---
aside: true
---

<script setup>
import loadSpec from '../../utils/loadSpec'
import { ref, onMounted } from 'vue'

const specs = ref(null)

onMounted(async () => {
  const res = await fetch('/device-specs/pro/v2.yaml')
  const yamlText = await res.text()
  specs.value = loadSpec(yamlText).value
})
</script>

# Pro (PR2)

<DownloadSpecButton v-if="specs" :spec="specs" deviceTitle="Pro (PR2)" />

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

<DeviceSpecSection v-if="specs" :spec="specs" sectionName="components" />

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
