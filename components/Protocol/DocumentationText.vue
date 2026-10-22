<script setup lang="ts">
import { computed } from 'vue'
import { documentationTextParts } from '../../utils/MessageDocumentation'
const props = defineProps<{ text: string }>()
const parts = computed(() => documentationTextParts(props.text))
</script>

<template>
  <template v-for="(part, index) in parts" :key="index">
    <a v-if="part.href" :href="part.href" target="_blank" rel="noopener noreferrer">{{ part.text }}</a><template v-else>{{ part.text }}</template>
  </template>
</template>
