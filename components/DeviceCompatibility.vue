<template>
  <div :class="['device-compatibility', { 'device-compatibility--compact': compact }]">
    <div class="device-compatibility__header">
      <span class="device-compatibility__title">Device compatibility</span>
      <span class="device-compatibility__description">V3 protocol</span>
    </div>
    <div class="device-compatibility__chips">
      <a
        v-for="device in devices"
        :key="device.id"
        :href="device.link"
        class="device-chip"
      >
        {{ device.name }}
      </a>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  devices: {
    type: Array,
    required: true,
    validator: (value) => value.every(d => d.name && d.link && d.id)
  },
  compact: {
    type: Boolean,
    default: true
  }
});
</script>

<style scoped>
.device-compatibility {
  display: inline-block;
  background: #fef4ed;
  border-radius: 6px;
  padding: 0.8rem 1rem;
  border: 1px solid #fcd5c1;
  margin: 0.5rem 0;
}

.dark .device-compatibility {
  background: #2a2a2a;
  border-color: #444444;
}

.device-compatibility__header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.6rem;
}

.device-compatibility__title {
  font-weight: 600;
  color: #333333;
  font-size: 0.95rem;
}

.dark .device-compatibility__title {
  color: #ffffff;
}

.device-compatibility__description {
  font-size: 0.8rem;
  color: #666666;
  background: #ffffff;
  border: 1px solid #ddd;
  border-radius: 3px;
  padding: 0.2rem 0.4rem;
}

.dark .device-compatibility__description {
  color: #aaaaaa;
  background: #333333;
  border-color: #555555;
}

.device-compatibility__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.device-compatibility--compact .device-compatibility__chips {
  gap: 0.4rem;
}

.device-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: white;
  border: 1px solid #fc7c3d;
  border-radius: 16px;
  padding: 0.35rem 0.75rem;
  font-size: 0.85rem;
  font-weight: 500;
  color: #fc7c3d;
  text-decoration: none;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.dark .device-chip {
  background: #333333;
  border-color: #fc7c3d;
  color: #ffffff;
}

.device-chip:hover {
  background: #fc7c3d;
  color: white;
  box-shadow: 0 2px 6px rgba(252, 124, 61, 0.3);
}

.dark .device-chip:hover {
  background: #fc7c3d;
  color: white;
  box-shadow: 0 2px 6px rgba(252, 124, 61, 0.5);
}
</style>
