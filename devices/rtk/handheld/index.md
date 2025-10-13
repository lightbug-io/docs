---
aside: false
---

<script setup>
import DownloadFile from '../../../components/DownloadFile.vue'
import DownloadSpecFile from '../../../components/DownloadSpecFile.vue'
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

- Using the [default application](/devices/rtk/handheld/application) for RTK positions cloud streaming and logging, at 1Hz, 2Hz or 5Hz update rates.
- [Forwarding the cloud streamed data to external services](/apps/admin/devices/forwarding), via webhooks or MQTT.
- Sharing snapshots of data publicly with others to view, [via public links](/apps/chasm/share/).

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
