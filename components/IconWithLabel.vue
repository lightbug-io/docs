<template>
  <span :class="['icon-with-label', variant]">
    <Icon :name="iconName" :size="size" />
    <span class="label">{{ label }}</span>
  </span>
</template>

<script setup>
defineProps({
  iconName: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  size: {
    type: [String, Number],
    default: '1em'
  },
  variant: {
    type: String,
    default: 'inline',
    validator: (value) => ['inline', 'badge'].includes(value)
  }
});
</script>

<style scoped>
.icon-with-label {
  display: inline-flex;
  align-items: center;
  gap: 0.4em;
  white-space: nowrap;
  background: #fef4ed;
  border-radius: 4px;
  padding: 0.3em 0.6em;
  font-weight: 500;
  vertical-align: middle;
  border: 1px solid transparent;
}

.dark .icon-with-label {
  background: #333333;
  border: 1px solid #555555;
}

.icon-with-label.inline .label {
  color: inherit;
}

.dark .icon-with-label.inline .label {
  color: #ffffff;
}

.icon-with-label.badge {
  background: #fef4ed;
  border: 1px solid #fc7c3d;
  border-radius: 4px;
  padding: 0.3em 0.6em;
  font-size: 0.9em;
  font-weight: 500;
}

.dark .icon-with-label.badge {
  background: #333333;
  border-color: #fc7c3d;
}

.icon-with-label.badge .label {
  color: #fc7c3d;
}

.dark .icon-with-label.badge .label {
  color: #ffffff;
}
</style>
