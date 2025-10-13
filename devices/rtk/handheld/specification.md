---
aside: true
---

<script setup>
import spec from '../../../public/device-specs/rtk/v2.yaml?raw'
import loadSpec from '../../../utils/loadSpec'

const specs = loadSpec(spec)
</script>

# Handheld RTK (RH2)

<DownloadSpecButton :spec="specs" deviceTitle="Handheld RTK (RH2)" />

## Images

<DeviceSpecImages :spec="specs" />

## Overview

<DeviceSpecOverview :spec="specs" />

## Physical

<DeviceSpecSection :spec="specs" sectionName="physical" />

## Integrations

<DeviceSpecSection :spec="specs" sectionName="integrations" />

## User Interface

<DeviceSpecSection :spec="specs" sectionName="user interface" />

## Connectivity

<DeviceSpecSection :spec="specs" sectionName="connectivity" />

## Positioning

<DeviceSpecSection :spec="specs" sectionName="positioning" />

## Sensors

<DeviceSpecSection :spec="specs" sectionName="sensors" />

## Battery

<DeviceSpecSection :spec="specs" sectionName="battery" />

## Charging

<DeviceSpecSection :spec="specs" sectionName="charging" />

## Components

<DeviceSpecSection :spec="specs" sectionName="components" />
