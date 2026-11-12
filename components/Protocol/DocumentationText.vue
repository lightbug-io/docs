<script setup lang="ts">
import { computed } from 'vue'
import { withBase } from 'vitepress'
import { documentationTextParts } from '../../utils/MessageDocumentation'
const props = defineProps<{ text: string; messages?: Record<string, any> }>()
const parts = computed(() => documentationTextParts(props.text, props.messages, withBase))
</script>

<template>
  <template v-for="(part, index) in parts" :key="index">
    <a v-if="part.href" :href="part.href" :target="part.href.startsWith('http') ? '_blank' : undefined" :rel="part.href.startsWith('http') ? 'noopener noreferrer' : undefined">{{ part.text }}</a><template v-else>{{ part.text }}</template>
  </template>
</template>
