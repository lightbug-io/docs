<template>
  <div>
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
