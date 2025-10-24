<template>
  <svg
    :class="['inline-icon', `icon-${name}`]"
    :width="size"
    :height="size"
    :viewBox="viewBox"
    :fill="fill"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g data-name="Layer 2">
      <g :data-name="name">
        <path :d="pathData" />
      </g>
    </g>
  </svg>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  size: {
    type: [String, Number],
    default: '1em'
  },
  fill: {
    type: String,
    default: 'currentColor'
  }
});

// Icon definitions from eva-icons
const iconPaths = {
  'share-outline': {
    viewBox: '0 0 24 24',
    path: 'M18 15a3 3 0 0 0-2.1.86L8 12.34V12v-.33l7.9-3.53A3 3 0 1 0 15 6v.34L7.1 9.86a3 3 0 1 0 0 4.28l7.9 3.53V18a3 3 0 1 0 3-3zm0-10a1 1 0 1 1-1 1 1 1 0 0 1 1-1zM5 13a1 1 0 1 1 1-1 1 1 0 0 1-1 1zm13 6a1 1 0 1 1 1-1 1 1 0 0 1-1 1z'
  }
};

const viewBox = computed(() => {
  return iconPaths[props.name]?.viewBox || '0 0 24 24';
});

const pathData = computed(() => {
  return iconPaths[props.name]?.path || '';
});
</script>

<style scoped>
.inline-icon {
  display: inline;
  vertical-align: middle;
  margin: 0 0.25em;
  color: #fc7c3d;
}
</style>
