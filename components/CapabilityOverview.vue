<script setup lang="ts">
import CapabilityDevices from './CapabilityDevices.vue'
defineProps<{ capability: string }>()
</script>

<template>
  <div class="capability-overview">
    <div class="capability-overview__layout">
      <div class="capability-overview__intro"><slot /></div>
      <CapabilityDevices :capability="capability" />
    </div>
  </div>
</template>

<style scoped>
.capability-overview { container-type: inline-size; margin: 1rem 0 1.5rem; }
.capability-overview__layout { display: grid; grid-template-columns: minmax(0, 1fr); gap: 1rem; align-items: start; }
.capability-overview__intro { min-width: 0; }
.capability-overview__intro :deep(p:first-child) { margin-top: 0; }
.capability-overview__intro :deep(p:last-child) { margin-bottom: 0; }
@container (min-width: 36rem) {
  .capability-overview__layout { grid-template-columns: minmax(0, 1fr) 11.5rem; gap: 1.5rem; }
}
</style>
