<template>
  <div v-if="hasContent">
    <div v-for="(example, index) in examples" :key="index">
      <h5 v-if="!hideHeaders">{{ example.name }}</h5>
      <span v-if="example.description" style="white-space: pre-line;">{{ example.description }}</span>
      <Message :byteString="example.bytes" :yaml-data="yamlData" :defaultCollapsed="false" :realDeviceInfo="example.real"/>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import Message from './Message.vue'

const props = defineProps({
  messageId: {
    type: Number,
    required: true
  },
  yamlData: {
    type: Object,
    required: true
  },
  hideHeaders: {
    type: Boolean,
    default: false
  },
  maxExamples: {
    type: Number,
    default: null
  }
})

const examples = computed(() => {
  const messageData = props.yamlData?.messages?.[props.messageId]
  const allExamples = messageData?.examples || []
  return props.maxExamples ? allExamples.slice(0, props.maxExamples) : allExamples
})

const hasContent = computed(() => examples.value.length > 0)

// Expose for parent components to check
defineExpose({
  hasContent
})
</script>
