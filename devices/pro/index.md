---
aside: true
---

<script setup>
import spec from '../../public/device-specs/pro/v3.yaml?raw'
import loadSpec from '../../utils/loadSpec'

const specs = loadSpec(spec)
</script>

# Pro

<div class="pro-overview">
<div class="pro-overview__layout">
<div class="pro-overview__copy" id="pro-pr2">

The current Pro is Pro3 (PR3), a different hardware generation from [ProN (PR2)](/devices/history/PR2). The two generations share the same external appearance, so use the product code and device ID to identify your device before following its instructions. ProN (PR2) is now a legacy model and is no longer in production.

<DownloadSpecButton :spec="specs" deviceTitle="Pro (PR3)" label="Download PR3 PDF" />

## Feature guides {#capabilities}

<DeviceCapabilities device="PR3" />

</div>

<ProImageGallery :images="specs.product.images" />

</div>
</div>

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

<style scoped>
/* cspell:ignore minmax */
.pro-overview { container-type: inline-size; }
.pro-overview__layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 1.5rem;
  align-items: start;
  margin-top: 1.5rem;
}
.pro-overview__copy { min-width: 0; }
.pro-overview__copy > :first-child { margin-top: 0; }
.pro-overview__copy > :last-child { margin-bottom: 0; }
.pro-overview__layout > :deep(.pro-gallery) { justify-self: center; }
/* Use the article's width, not the viewport: navigation may occupy both sides. */
@container (min-width: 42rem) {
  .pro-overview__layout { grid-template-columns: minmax(0, 1fr) 18rem; gap: 2rem; }
  .pro-overview__layout > :deep(.pro-gallery) { justify-self: end; }
}
</style>
