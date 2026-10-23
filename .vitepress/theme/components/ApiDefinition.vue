<script setup lang="ts">
import { nextTick, onMounted, onUnmounted } from 'vue'
import { withBase } from 'vitepress'
import { revealApiDefinition } from '../../../utils/ApiDefinitionAnchor'

const props = defineProps<{ version: number }>()
const reveal = async () => {
  await nextTick()
  revealApiDefinition()
}
onMounted(() => {
  reveal()
  window.addEventListener('hashchange', reveal)
  window.addEventListener('popstate', reveal)
})
onUnmounted(() => {
  window.removeEventListener('hashchange', reveal)
  window.removeEventListener('popstate', reveal)
})
</script>

<template>
  <div class="api-definition">
    <p>
      This endpoint and its referenced definitions, including documentation overrides.
      <a :href="withBase(`/swagger/v${props.version}.json`)">Full original OpenAPI spec (JSON)</a>.
    </p>
    <details class="details custom-block">
      <summary>View endpoint OpenAPI definition</summary>
      <slot />
    </details>
  </div>
</template>
