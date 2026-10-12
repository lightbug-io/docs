<template>
  <DownloadPdfButton :get-pdf-data="getPdfData" :label="label" />
</template>

<script setup>
import { computed } from 'vue'
import DownloadPdfButton from './DownloadPdfButton.vue'
import { useDeviceSpec } from '../composables/useDeviceSpec.js'

const props = defineProps({
  // Parsed spec object (from loadSpec)
  spec: {
    type: Object,
    required: true
  },
  // Optional: Device title override
  deviceTitle: {
    type: String,
    required: false
  },
  // Optional: Button label override
  label: {
    type: String,
    default: 'Download PDF'
  },
  imagePlaceholders: {
    type: Array,
    required: false,
    default: () => []
  },
  pdfSectionOrder: {
    type: Array,
    required: false,
    default: () => []
  },
  pdfUrl: {
    type: String,
    required: false,
    default: ''
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
const { specs, displaySpecs, deviceTitle: computedTitle, genericSections, getPdfData: getBasePdfData } = useDeviceSpec(
  specRef,
  { termLinkMap: props.termLinkMap }
)

// Wrap getPdfData to allow title override
function getPdfData() {
  const data = getBasePdfData()
  if (props.deviceTitle) {
    data.title = props.deviceTitle
  }
  if (props.pdfUrl) {
    data.pdfUrl = props.pdfUrl
  }
  if (props.imagePlaceholders.length) {
    data.imagePlaceholders = props.imagePlaceholders
  }
  if (props.pdfSectionOrder.length) {
    const order = props.pdfSectionOrder.map(section => section.toLowerCase())
    data.sections.sort((a, b) => order.indexOf(a.title.toLowerCase()) - order.indexOf(b.title.toLowerCase()))
  }
  return data
}
</script>
