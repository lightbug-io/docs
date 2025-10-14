<template>
  <div v-if="hasContent">
    <PayloadTable :messageId="messageId" headerText="" :yaml-data="yamlData"/>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import PayloadTable from './PayloadTable.vue'

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

const hasContent = computed(() => {
  const messageData = props.yamlData?.messages?.[props.messageId]
  const fields = messageData?.data || []
  return fields && typeof fields === 'object' && Object.keys(fields).length > 0
})

// Expose for parent components to check
defineExpose({
  hasContent
})
</script>
