<template>
  <div v-if="examples.length > 0">
    <div v-for="(example, index) in examples" :key="index">
      <h5>{{ example.name }}</h5>
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
  }
})

const examples = computed(() => {
  const messageData = props.yamlData?.messages?.[props.messageId]
  return messageData?.examples || []
})
</script>
