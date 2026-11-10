<script setup lang="ts">
import { withBase } from 'vitepress'
import { capabilityGroups } from '../utils/DeviceCapabilities'
const groups = capabilityGroups()
</script>

<template>
  <div class="capability-catalogue">
    <section v-for="group in groups" :key="group.id">
      <h2 :id="group.id">{{ group.title }}</h2>
      <div class="capability-catalogue__grid">
        <a v-for="feature in group.capabilities" :key="feature.id" :href="withBase(feature.link)">
          <strong>{{ feature.title }} <span aria-hidden="true">↗</span></strong>
          <span>{{ feature.summary }}</span>
        </a>
      </div>
    </section>
  </div>
</template>

<style scoped>
.capability-catalogue__grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 15rem), 1fr)); gap: .8rem; }
.capability-catalogue__grid > a { display: flex; flex-direction: column; gap: .5rem; padding: 1.1rem; border: 1px solid var(--vp-c-divider); border-radius: 10px; background: var(--vp-c-bg-soft); text-decoration: none; }
.capability-catalogue__grid > a:hover { border-color: var(--vp-c-brand-1); }
.capability-catalogue__grid > a:focus-visible { outline: 2px solid var(--vp-c-brand-1); outline-offset: 3px; }
.capability-catalogue__grid strong { display: flex; justify-content: space-between; gap: .75rem; font-size: .95rem; }
.capability-catalogue__grid a > span { color: var(--vp-c-text-2); font-size: .875rem; line-height: 1.6; }
</style>
