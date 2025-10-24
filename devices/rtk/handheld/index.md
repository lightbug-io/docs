---
aside: false
---

<script setup>
import { useDeviceSpec } from '../../../composables/useDeviceSpec.js'
import spec from '../../../public/device-specs/rtk/v2.yaml?raw'
import loadSpec from '../../../utils/loadSpec'

const specs = loadSpec(spec)
const { getPdfData } = useDeviceSpec(specs, {})
</script>

# Handheld RTK (RH2)

Reliable, ultra-accurate & affordable RTK tracking. For centimeter-level data capture and safety applications.

## Guides

Our RH2 guides are still a work in progress, but these links may help you get started for expected use cases:

- Using the [default application](/devices/rtk/handheld/application) for RTK positions, cloud streaming and logging, at 1Hz, 2Hz or 5Hz update rates.
- [Forwarding the cloud streamed data](/apps/admin/devices/forwarding) in byte or JSON format:
  - [to the Lightbug Cloud application](/apps/admin/devices/forwarding#lightbug-cloud)
  - [via webhooks or MQTT](/apps/admin/devices/forwarding#create-a-connection).
- [Forwarding the cloud streamed data to external services](/apps/admin/devices/forwarding), via webhooks or MQTT to other systems
- Sharing snapshots of data [from the admin portal](/apps/admin/devices/sharing), publicly with others to view, [via public links](/apps/chasm/share/), and downloading it in multiple formats including NMEA, CSV and JSON.
- Using the second processor, [Toit SDK](/devices/api/sdks/toit/)
  - With the default [Survey application](/devices/api/sdks/toit/applications/survey/)
  - With custom Toit applications, using the [Toit SDK documentation](/devices/api/sdks/toit/)

## Downloads

<div style="display: flex; gap: 16px; flex-wrap: wrap;">
<DownloadFile
    v-if="specs?.product?.booklet"
    :url="specs.product.booklet"
    :previewImage="specs.product.booklet_preview"
    label="Promotional Brochure"
/>
<DownloadSpecFile
    :get-pdf-data="getPdfData"
    preview-image="https://upload.r2.lb.chasm.cloud/2025/10/chrome_c9GfH7UCoY.png"
    label="Technical Specification"
/>
</div>

## Links

- [Lightbug RH2 RTK Handset (Product Page) - lightbug.io](https://lightbug.io/product/rtk-high-accuracy/lb-dev-rh2/)
