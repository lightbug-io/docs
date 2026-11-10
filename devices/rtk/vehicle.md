---
aside: false
---

<script setup>
import { computed } from 'vue'
import spec from '../../public/device-specs/vehicle/v3.yaml?raw'
import loadSpec from '../../utils/loadSpec'

// The demo uses the VT3 form factor; only reuse its exterior images, not its specifications.
const specs = loadSpec(spec)
const viewLabels = ['Front angle', 'Top side', 'Other side', 'Side']
const viewScales = [1.6, 1.6, 1.25, 1.6]
const viewOffsets = [-27, -26, 0, -53]
const galleryImages = computed(() => (specs.value?.product?.images ?? []).map((src, index) => ({
  src,
  label: viewLabels[index] ?? `Image ${index + 1}`,
  alt: `VT3 enclosure, ${(viewLabels[index] ?? `image ${index + 1}`).toLowerCase()} view`,
  fit: 'cover',
  scale: viewScales[index] ?? 1,
  offsetY: viewOffsets[index] ?? 0,
})))
</script>

# Powered Vehicle RTK (VTRTK)

<DeviceOverview>

A powered RTK tracker for vehicles, with advanced GNSS and RTK capabilities.

Currently available for demo, with the form factor of a [VT3](/devices/vehicle/) device, and capabilities of an [RH2](/devices/rtk/handheld/) device.


<template #media>
<DeviceImageGallery
  id="images"
  :images="galleryImages"
  aria-label="VT3 enclosure gallery for the VTRTK demo"
  caption="VT3 enclosure shown. The VTRTK demo uses this form factor."
/>
</template>

</DeviceOverview>
