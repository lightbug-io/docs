<template>
  <div class="booklet-btn-wrapper">
    <button @click="openBooklet" class="booklet-download-btn">{{ props.label }}</button>
  </div>
</template>

<script setup>
const props = defineProps({
  url: {
    type: String,
    required: true
  },
  label: {
    type: String,
    default: 'Promotional Booklet'
  },
  useProxy: {
    type: Boolean,
    default: false
  }
})

function openBooklet() {
  let finalUrl = props.url
  window.open(finalUrl, '_blank')
}
</script>

<style scoped>
.booklet-btn-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  margin-left: 8px;
}
.booklet-download-btn {
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
.booklet-download-btn:hover {
  background: var(--vp-c-bg, #e6eaf1);
  border-color: var(--vp-c-brand, #409eff);
  color: var(--vp-c-brand, #409eff);
}
</style>
