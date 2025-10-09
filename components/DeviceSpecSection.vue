<template>
  <div v-if="section">
    <table>
      <tbody>
        <template v-for="subsection in section.subsections" :key="subsection.name">
          <tr>
            <th class="subsection-heading" colspan="2">{{ subsection.title }}</th>
          </tr>
          <tr v-for="row in subsection.rows" :key="row.label">
            <th>{{ row.label }}</th>
            <td v-html="row.value"></td>
          </tr>
        </template>
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
  // The section name to render (e.g., 'physical', 'connectivity', 'sensors')
  sectionName: {
    type: String,
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
const { genericSections } = useDeviceSpec(specRef, { termLinkMap: props.termLinkMap })

// Find the specific section to render
const section = computed(() => {
  return genericSections.value.find(s => s.name === props.sectionName)
})
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
.subsection-heading {
  background: #e0e7ef;
  font-weight: bold;
  text-align: left;
  font-size: 1em;
  padding: 10px 8px;
  border-bottom: 2px solid #bfc8d6;
}
</style>
