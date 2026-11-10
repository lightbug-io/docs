<script setup lang="ts">
import { computed } from 'vue'
import { withBase } from 'vitepress'
import { devicesForCapability } from '../utils/DeviceCapabilities'

const props = defineProps<{ capability: string }>()
const devices = computed(() => devicesForCapability(props.capability))
</script>

<template>
  <div class="capability-devices">
    <p class="capability-devices__note">Documented models and revision limits. This list is still being expanded.</p>
    <ul>
      <li v-for="device in devices" :key="device.id">
        <a class="capability-devices__name" :href="withBase(device.link)">{{ device.title }}</a>
        <span>{{ device.note }} <a v-if="device.detailLink" :href="withBase(device.detailLink)">{{ device.detailTitle }}</a></span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.capability-devices__note { color: var(--vp-c-text-2); font-size: .875rem; }
.capability-devices ul { list-style: none; padding: 0; }
.capability-devices li { display: grid; grid-template-columns: minmax(8rem, 1fr) 3fr; gap: 1rem; border-top: 1px solid var(--vp-c-divider); padding: .8rem 0; margin: 0; font-size: .9rem; line-height: 1.6; }
.capability-devices__name { font-weight: 600; }
.capability-devices li > span { color: var(--vp-c-text-2); }
@media (max-width: 480px) { .capability-devices li { grid-template-columns: 1fr; gap: .2rem; } }
</style>
