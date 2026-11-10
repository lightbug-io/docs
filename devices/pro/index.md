---
aside: true
---

<script setup>
import spec from '../../public/device-specs/pro/v3.yaml?raw'
import loadSpec from '../../utils/loadSpec'

const specs = loadSpec(spec)
const viewLabels = ['Front angle', 'Top side', 'Back', 'Side']
const galleryImages = specs.product.images.map((src, index) => ({
  src,
  label: viewLabels[index] ?? `Image ${index + 1}`,
  alt: `Shared Pro enclosure, ${(viewLabels[index] ?? `image ${index + 1}`).toLowerCase()} view`,
  // Reframe the white margins and lower side artwork without changing the source images.
  fit: 'cover',
  scale: 1.25,
  offsetY: index === 3 ? -20.833333 : 0,
}))
</script>

# Pro

<DeviceOverview id="pro-pr2">

The current Pro is Pro3 (PR3), a different hardware generation from [ProN (PR2)](/devices/history/PR2). The two generations share the same external appearance, so use the product code and device ID to identify your device before following its instructions. ProN (PR2) is now a legacy model and is no longer in production.

<DownloadSpecButton :spec="specs" deviceTitle="Pro (PR3)" label="Download PR3 PDF" />

## Feature guides {#capabilities}

<DeviceCapabilities device="PR3" />

<template #media>
<DeviceImageGallery
  id="images"
  :images="galleryImages"
  aria-label="Pro enclosure gallery"
  caption="Shared exterior views for Pro3 and ProN/PR2."
/>
</template>

</DeviceOverview>

## Specifications

The overview, tables and PDF use the same Pro3 specification. Optional sensors and features requiring compatible firmware are labelled in the tables. Component specifications describe the individual parts, not additional finished-product guarantees.

### Overview

<DeviceSpecOverview :spec="specs" />

### Physical

<DeviceSpecSection :spec="specs" sectionName="physical" />

### Integrations

<DeviceSpecSection :spec="specs" sectionName="integrations" />

### User interface

<DeviceSpecSection :spec="specs" sectionName="user interface" />

### Connectivity

<DeviceSpecSection :spec="specs" sectionName="connectivity" />

### Positioning

<DeviceSpecSection :spec="specs" sectionName="positioning" />

### Sensors

<DeviceSpecSection :spec="specs" sectionName="sensors" />

### Battery

<DeviceSpecSection :spec="specs" sectionName="battery" />

### Charging {#charging-specification}

<DeviceSpecSection :spec="specs" sectionName="charging" />

### Components

<DeviceSpecSection :spec="specs" sectionName="components" />
