<template>
  <span v-html="svgString" class="inline-icon"></span>
</template>

<script setup>
import { computed } from 'vue';
import * as eva from 'eva-icons';

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
const svgString = computed(() => {
  const icon = eva?.icons?.[props.name];
  if (!icon) return '';
  return icon.toSvg({
    fill: props.fill,
    width: props.size,
    height: props.size
  });
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
