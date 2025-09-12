<template>
  <div class="yaml-btn-wrapper">
    <button @click="downloadYaml" class="yaml-download-btn">{{ props.label }}</button>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  getYamlData: Function,
  label: {
    type: String,
    default: 'Download YAML'
  },
  filename: {
    type: String,
    default: 'spec.yaml'
  }
})

function downloadYaml() {
  const yamlText = props.getYamlData ? props.getYamlData() : ''
  const blob = new Blob([yamlText || ''], { type: 'text/yaml;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = props.filename || 'spec.yaml'
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
</script>

<style scoped>
.yaml-btn-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  margin-left: 8px;
}
.yaml-download-btn {
  display: inline-block;
  min-width: 100px;
  max-width: 220px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  background: var(--vp-c-bg-alt, #f5f7fa);
  color: var(--vp-c-text-1, #222);
  border: 1px solid var(--vp-c-divider, #d1d5db);
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 0.95rem;
  font-weight: 500;
  box-shadow: 0 2px 8px 0 rgba(0,0,0,0.04);
  cursor: pointer;
  transition: background 0.2s, border 0.2s;
}
.yaml-download-btn:hover {
  background: var(--vp-c-bg, #e6eaf1);
  border-color: var(--vp-c-brand, #409eff);
  color: var(--vp-c-brand, #409eff);
}
</style>
