<template>
  <div v-if="specs && specs.product && specs.product.images && specs.product.images.length" class="device-image-row">
    <img
      v-for="(img, idx) in specs.product.images"
      :key="img"
      :src="img.startsWith('https://lightbug.io/') || img.startsWith('https://lightbug.cloud/') || img.startsWith('https://upload.r2.lb.chasm.cloud/') ? `https://cors-proxy.lightbug.workers.dev?url=${encodeURIComponent(img)}` : img"
      :alt="`Device image ${idx+1}`"
      class="device-image"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useDeviceSpec } from '../composables/useDeviceSpec.js'

const props = defineProps({
  // Parsed spec object (from loadSpec)
  spec: {
    type: Object,
    required: true
  }
})

// Use the composable with the parsed spec object
const specRef = computed(() => props.spec)
const { specs } = useDeviceSpec(specRef)
</script>

<style scoped>
.device-image-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1em;
  margin: 1em 0;
  max-width: 100%;
  justify-content: center;
}
.device-image {
  flex: 1 1 180px;
  max-width: 180px;
  min-width: 120px;
  width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  object-fit: contain;
}
</style>
