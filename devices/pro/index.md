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
<div class="pro-overview__copy">

The current Pro is Pro3 (PR3), a different hardware generation from [ProN (PR2)](/devices/history/PR2). The two generations share the same external appearance, so use the product code and hardware revision to identify your device before following its instructions. ProN (PR2) is now a legacy model and is no longer in production.

<DownloadSpecButton :spec="specs" deviceTitle="Pro (PR3)" label="Download PR3 PDF" />

## Feature guides {#capabilities}

<DeviceCapabilities device="PR3" />

</div>

<ProImageGallery />

</div>
</div>

## LED indicators

The [four power LED capability](/devices/capabilities/four-power-leds) defines the normal battery and charging patterns. On revisions 02–04 these indicators are orange. They are also used during startup and for alerts, so four lit indicators are not always a battery reading.

There is no separate GPS/mobile-network colour table on Pro3. The older [PR2 example of two red and four orange lights](/devices/history/PR2#two-red-lights-and-four-orange-lights-after-a-restart) is not this model’s layout. Use the [LED guide](/guides/leds) for the first checks when a pattern is unfamiliar.

## Charging

Use the charging accessory and power supply specified for your Pro3 revision, within the [Pro3 charging limits](#charging-specification). The actual charge rate depends on the input source, battery and thermal conditions. Do not apply PR2 voltage/current ratings or charging-time instructions to Pro3.

See [four power LED charging patterns](/devices/capabilities/four-power-leds#charging) for the normal blinking and steady states. A steady high-charge display is not an exact 100% reading.

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

## Earlier Pro generations {#pro-pr2}

The [ProN/PR2 archive](/devices/history/PR2) contains its specifications, images and diagnostic-light information. PR2 is no longer in production.

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
