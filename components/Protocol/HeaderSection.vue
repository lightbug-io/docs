<template>
  <div v-if="hasRelevantHeaders">
    <HeaderTable :messageId="messageId" headerText="" :yaml-data="yamlData"/>
    <small>This is an extract of header fields that are relevant to this message type, you can find them all documented in the <a :href="withBase('/devices/api/protocol/headers')">Headers</a> section.</small>
  </div>
</template>

<script setup>
import { withBase } from 'vitepress'
import { computed } from 'vue'
import HeaderTable from './HeaderTable.vue'

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

const hasRelevantHeaders = computed(() => {
  const messageData = props.yamlData?.messages?.[props.messageId]
  return messageData?.header && messageData.header.length > 0
})

// Expose for parent components to check
defineExpose({
  hasContent: hasRelevantHeaders
})
</script>
