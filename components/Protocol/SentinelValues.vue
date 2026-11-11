<script setup lang="ts">
import type { ProtocolSentinels } from '../../utils/ProtocolSentinels'

defineProps<{ sentinels?: ProtocolSentinels }>()
</script>

<template>
  <div v-if="sentinels && Object.keys(sentinels).length" class="sentinel-values">
    <strong>Sentinel values (raw, without conversion or units):</strong>
    <ul>
      <li v-for="(sentinel, value) in sentinels" :key="value">
        <code>{{ value }}</code>: <strong>{{ sentinel.name }}</strong><span v-if="sentinel.description">: {{ sentinel.description }}</span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.sentinel-values { margin-top: 8px; font-size: 0.95em; }
ul { margin: 4px 0 0; padding-left: 18px; }
</style>
