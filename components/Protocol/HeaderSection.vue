<template>
  <div v-if="hasRelevantHeaders">
    <h2>Header</h2>
    <HeaderTable :messageId="messageId" headerText="" :yaml-data="yamlData"/>
    <small>This is an extract of header fields that are relevant to this message type, you can find them all documented in the <a href="../protocol/headers.md">Headers</a> section.</small>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import HeaderTable from '../HeaderTable.vue'

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
  return messageData?.headers && Object.keys(messageData.headers).length > 0
})
</script>
