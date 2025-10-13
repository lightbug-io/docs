<template>
  <div>
    <h2>Payload</h2>
    <PayloadTable :messageId="messageId" headerText="" :yaml-data="yamlData"/>
  </div>
</template>

<script setup>
import PayloadTable from '../PayloadTable.vue'

defineProps({
  messageId: {
    type: Number,
    required: true
  },
  yamlData: {
    type: Object,
    required: true
  }
})
</script>
