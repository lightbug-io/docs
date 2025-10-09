<template>
  <div class="download-btn-wrapper" @click="openBooklet" :title="`Download ${props.label}`">
    <div class="download-card">
      <img v-if="props.previewImage" :src="props.previewImage" alt="File preview" class="preview-image" />
      <div class="overlay">{{ displayOverlay }}</div>
    </div>
    <div class="label-under">{{ props.label }}</div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  url: {
    type: String,
    required: true
  },
  label: {
    type: String,
    default: ''
  },
  useProxy: {
    type: Boolean,
    default: false
  },
  previewImage: {
    type: String,
    default: null
  },
  overlayText: {
    type: String,
    default: null
  }
})

const displayOverlay = computed(() => {
  if (props.overlayText) return props.overlayText;
  const url = props.url;
  const parts = url.split('.');
  const extension = parts[parts.length - 1]?.toUpperCase();
  return extension || 'FILE';
});

function openBooklet() {
  let finalUrl = props.url
  window.open(finalUrl, '_blank')
}
</script>

<style scoped>
.download-btn-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-left: 8px;
  width: 148px;
  cursor: pointer;
}

.download-card {
  width: 148px; /* Scaled down A4 width (210mm -> ~148px at 72dpi) */
  height: 210px; /* Scaled down A4 height (297mm -> ~210px at 72dpi) */
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  transition: box-shadow 0.2s;
}

.download-btn-wrapper:hover .download-card {
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.overlay {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: bold;
}

.label-under {
  margin-top: 8px;
  font-size: 0.9rem;
  color: #333;
  font-weight: 500;
  text-align: center;
  align-self: center;
}
</style>
