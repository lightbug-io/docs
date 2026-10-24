<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref } from 'vue'
import { withBase } from 'vitepress'
import { revealApiDefinition } from '../../../utils/ApiDefinitionAnchor'

const props = defineProps<{ version: number }>()
const container = ref<HTMLElement>()
const copyStatus = ref('')
function setFolds(open: boolean) {
  container.value?.querySelectorAll<HTMLDetailsElement>('.api-yaml-fold').forEach(fold => { fold.open = open })
}
async function copyYaml() {
  const text = container.value?.querySelector<HTMLElement>('.api-yaml-document')?.dataset.yaml
  if (text === undefined) return
  try {
    await navigator.clipboard.writeText(text)
    copyStatus.value = 'Copied'
  } catch {
    copyStatus.value = 'Copy failed. Please try Copy full YAML again.'
  }
}
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
  <div ref="container" class="api-definition">
    <p>
      References are expanded below, except recursive definitions and references with sibling fields. Documentation overrides are included.
      <a :href="withBase(`/swagger/v${props.version}.json`)">Full original OpenAPI spec (JSON)</a>.
    </p>
    <details class="details custom-block">
      <summary>View endpoint OpenAPI definition</summary>
      <div class="api-yaml-controls" data-pagefind-ignore>
        <button type="button" @click="setFolds(true)">Expand all</button>
        <button type="button" @click="setFolds(false)">Collapse all</button>
        <button type="button" @click="copyYaml">Copy full YAML</button>
        <span role="status" aria-live="polite">{{ copyStatus }}</span>
      </div>
      <div class="api-yaml-view"><slot /></div>
    </details>
  </div>
</template>

<style scoped>
.api-yaml-controls { display: flex; gap: 12px; flex-wrap: wrap; margin: 16px 0; }
.api-yaml-controls button { color: var(--vp-c-brand-1); border: 1px solid var(--vp-c-divider); border-radius: 4px; padding: 4px 8px; }
.api-yaml-controls button:focus-visible, .api-definition :deep(.api-yaml-fold > summary:focus-visible) { outline: 2px solid var(--vp-c-brand-1); outline-offset: 2px; }
.api-yaml-view { overflow-x: auto; background: var(--vp-code-block-bg); border-radius: 8px; padding: 16px 0; }
.api-definition :deep(.api-yaml-document) { min-width: max-content; }
.api-definition :deep(.api-yaml-fold) { margin: 0; padding: 0; border: 0; }
.api-definition :deep(.api-yaml-fold > summary) { cursor: pointer; list-style: none; position: relative; margin: 0; padding: 0 24px 0 calc(24px + var(--api-yaml-indent, 0ch)); font-family: var(--vp-font-family-mono); font-size: var(--vp-code-font-size); line-height: 1.7; }
.api-definition :deep(.api-yaml-fold > summary::before) { content: '▸'; position: absolute; left: calc(8px + var(--api-yaml-indent, 0ch)); color: var(--vp-c-text-2); }
.api-definition :deep(.api-yaml-fold[open] > summary::before) { content: '▾'; }
.api-definition :deep(.api-yaml-fold > summary::-webkit-details-marker) { display: none; }
.api-definition :deep(.api-yaml-source) { white-space: pre; font-family: var(--vp-font-family-mono); font-size: inherit; color: var(--vp-c-text-1); background: none; padding: 0; font-weight: 400; }
.api-definition :deep(.api-yaml-chunk div[class*='language-']) { margin: 0; border-radius: 0; background: none; }
.api-definition :deep(.api-yaml-chunk pre) { padding: 0; }
.api-definition :deep(.api-yaml-chunk pre code) { padding: 0 24px; }
.api-definition :deep(.api-yaml-chunk .copy), .api-definition :deep(.api-yaml-chunk .lang) { display: none; }
</style>
