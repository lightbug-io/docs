---
aside: false
---

<script setup>
import DownloadFile from '../../../components/DownloadFile.vue'
import spec from '../../../public/device-specs/rtk/v2.yaml?raw'
import loadSpec from '../../../utils/loadSpec'
const specs = loadSpec(spec)
</script>

# Handheld RTK (RH2)

## Downloads

<DownloadFile
    v-if="specs?.product?.booklet"
    :url="specs.product.booklet"
    :previewImage="specs.product.booklet_preview"
    label="Promotional Brochure"
/>
