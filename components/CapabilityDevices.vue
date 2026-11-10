<script setup lang="ts">
import { computed } from 'vue'
import { withBase } from 'vitepress'
import { currentDevicesForCapability } from '../utils/DeviceCapabilities'

const props = defineProps<{ capability: string }>()
const devices = computed(() => currentDevicesForCapability(props.capability))
</script>

<template>
  <aside id="devices" class="capability-devices" aria-label="Current devices documented for this capability">
    <p class="capability-devices__title">Current devices</p>
    <ul>
      <li v-for="device in devices" :key="device.id">
        <a :href="withBase(device.link)">{{ device.title }}</a>
      </li>
    </ul>
    <p class="capability-devices__note">Documented so far</p>
  </aside>
</template>

<style scoped>
.capability-devices { scroll-margin-top: 6rem; width: 100%; max-width: 13rem; padding: .85rem 1rem; border: 1px solid var(--vp-c-divider); border-radius: 10px; background: var(--vp-c-bg-soft); }
.capability-devices__title { margin: 0; font-size: .8rem; font-weight: 600; color: var(--vp-c-text-1); }
.capability-devices ul { list-style: none; padding: 0; margin: .5rem 0; }
.capability-devices li { margin: .2rem 0; font-size: .85rem; line-height: 1.6; }
.capability-devices a { text-decoration: none; }
.capability-devices a:hover { text-decoration: underline; }
.capability-devices a:focus-visible { outline: 2px solid var(--vp-c-brand-1); outline-offset: 3px; }
.capability-devices__note { margin: .5rem 0 0; font-size: .7rem; color: var(--vp-c-text-2); }
</style>
