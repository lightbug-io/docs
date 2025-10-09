<template>
  <div v-for="id in headerIds" :key="id" class="header-section">
    <h2 :id="`${id}-${headerData[id]?.name?.toLowerCase().replace(/\s+/g, '-')}`">
      {{ id }}: {{ headerData[id]?.name }}
    </h2>
    <div v-if="headerData[id]?.alpha" class="custom-block alpha">
      <p class="custom-block-title">🧪 Alpha</p>
      <div v-html="headerData[id]?.alpha"></div>
    </div>
    <p>
      Type: <code>{{ headerData[id]?.type ?? 'undefined' }}</code>
      <span v-if="headerData[id]?.unit"> Unit: <code>{{ headerData[id]?.unit }}</code></span>
    </p>
    <p class="description">{{ headerData[id]?.description }}</p>
    <HeaderInfo :header-id="id" :yaml-data="yamlData" />
  </div>
</template>

<script setup>
import HeaderInfo from './HeaderInfo.vue'

const props = defineProps({
  headerIds: {
    type: Array,
    required: true
  },
  yamlData: {
    type: Object,
    required: true
  }
})

const headerData = props.yamlData.header
</script>

<style scoped>
.header-section {
  margin-bottom: 2rem;
}

.description {
  white-space: pre-line;
}
</style>
