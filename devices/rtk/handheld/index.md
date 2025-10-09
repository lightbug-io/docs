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
