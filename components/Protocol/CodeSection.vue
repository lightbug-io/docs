<template>
  <div>
    <h2>Code</h2>
    <p>For convenience, the following constants can be used to reference this message type<span v-if="hasPayload"> and its payload fields</span>.</p>
    <MessageCodeGen :messageId="messageId" :yaml-data="yamlData"/>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import MessageCodeGen from './MessageCodeGen.vue'

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

const hasPayload = computed(() => {
  const messageData = props.yamlData?.messages?.[props.messageId]
  return messageData?.payload && Object.keys(messageData.payload).length > 0
})
</script>
