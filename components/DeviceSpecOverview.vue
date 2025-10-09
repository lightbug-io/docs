<template>
  <div>
    <p v-if="specs && specs.product && specs.product.description">{{ specs.product.description }}</p>
    <table v-if="specs">
      <tbody>
        <tr v-for="(value, key) in displaySpecs" :key="key">
          <th>{{ key }}</th>
          <td v-html="value"></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useDeviceSpec } from '../composables/useDeviceSpec.js'

const props = defineProps({
  // Parsed spec object (from loadSpec)
  spec: {
    type: Object,
    required: true
  },
  // Optional mapping from term -> url
  termLinkMap: {
    type: Object,
    required: false,
    default: () => ({})
  }
})

// Use the composable with the parsed spec object
const specRef = computed(() => props.spec)
const { specs, displaySpecs } = useDeviceSpec(specRef, { termLinkMap: props.termLinkMap })
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1em;
}
th, td {
  border: 1px solid #ddd;
  padding: 8px;
}
th {
  background: #f5f5f5;
  text-align: left;
}
</style>
