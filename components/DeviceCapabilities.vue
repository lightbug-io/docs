<script setup lang="ts">
import { computed } from 'vue'
import { withBase } from 'vitepress'
import { capabilitiesForDevice } from '../utils/DeviceCapabilities'

const props = defineProps<{ device: string }>()
const features = computed(() => capabilitiesForDevice(props.device))
</script>

<template>
  <div class="feature-guides">
    <p class="feature-guides__note">Selected shared features, with more guides to come. This is not a complete feature list.</p>
    <ul class="feature-guides__links">
      <li v-for="feature in features" :key="feature.capability">
        <a class="feature-guides__link" :href="withBase(feature.link)">{{ feature.title }} <span aria-hidden="true">↗</span></a>
        <a v-if="feature.detailLink" class="feature-guides__detail" :href="withBase(feature.detailLink)">{{ feature.detailTitle }}</a>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.feature-guides { margin: 1rem 0 1.5rem; }
.feature-guides__note { color: var(--vp-c-text-2); font-size: .875rem; margin: 0 0 .75rem; }
.feature-guides__links { display: flex; flex-wrap: wrap; gap: .65rem; padding: 0; list-style: none; }
.feature-guides__links li { display: flex; flex-direction: column; gap: .35rem; margin: 0; min-width: 0; }
.feature-guides__link { display: inline-flex; align-items: center; gap: .8rem; background: var(--vp-c-bg-soft); border: 1px solid var(--vp-c-divider); border-radius: 8px; padding: .55rem .8rem; font-size: .9rem; text-decoration: none; }
.feature-guides__link:hover { border-color: var(--vp-c-brand-1); }
.feature-guides__detail { padding-left: .8rem; font-size: .8rem; }
.feature-guides a:focus-visible { outline: 2px solid var(--vp-c-brand-1); outline-offset: 3px; }
</style>
