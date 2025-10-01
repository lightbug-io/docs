<template>
  <div>
    <div style="display: flex; align-items: flex-start; justify-content: space-between;">
      <div>
        <h1>{{ deviceTitle }}</h1>
        <span v-if="specs && specs.product && specs.product.description">{{ specs.product.description }}</span>
        <div v-if="specs && specs.product && specs.product.images && specs.product.images.length" class="device-image-row">
          <img v-for="(img, idx) in specs.product.images" :key="img" :src="img.startsWith('https://lightbug.io/') ? `https://cors-proxy.lightbug.workers.dev?url=${encodeURIComponent(img)}` : img" :alt="`Device image ${idx+1}`" class="device-image" />
        </div>
      </div>
    </div>
  <DownloadPdfButton :get-pdf-data="getPdfData" label="Spec PDF"/>
  <DownloadYamlButton :get-yaml-data="() => props.yamlText" :filename="(specs && specs.product && (specs.product.sku ? specs.product.sku + '.yaml' : specs.product.name + '.yaml')) || 'spec.yaml'" label="Spec YAML" />
  <DownloadBookletButton v-if="specs && specs.product && specs.product.booklet" :url="specs.product.booklet" />

  <h3>Overview</h3>
    <span v-if="specs && specs.product && specs.product.description">{{ specs.product.description }}</span>
  <table v-if="specs">
      <tbody>
        <tr v-for="(value, key) in displaySpecs" :key="key">
          <th>{{ key }}</th>
      <td v-html="value"></td>
        </tr>
      </tbody>
    </table>
    <div v-if="specs">
      <div v-for="section in genericSections" :key="section.name">
        <h3>{{ section.title }}</h3>
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
    </div>
    <div v-else>
      <slot name="loading">Loading...</slot>
    </div>
  </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue'
import yaml from 'js-yaml'
import DownloadPdfButton from './DownloadPdfButton.vue'
import DownloadYamlButton from './DownloadYamlButton.vue'
import DownloadBookletButton from './DownloadBookletButton.vue'

const props = defineProps({
  yamlText: {
    type: String,
    required: true
  }
  ,
  // Optional override for the device title. If provided, this will be used
  // instead of the title extracted from the YAML.
  deviceTitle: {
    type: String,
    required: false
  }
  ,
  // Optional mapping from term -> url. Allows overriding where terms link to.
  termLinkMap: {
    type: Object,
    required: false,
    default: () => ({})
  }
})

const specs = ref(null)
const displaySpecs = ref({})
const deviceTitle = ref('Device Specification')
const genericSections = ref([])

// An allowed list of keys to use from the YAML for now.. (and order)
const sectionKeys = ['physical','integrations','user interface','connectivity','positioning','sensors','battery','charging','components']

function normalizePhrase(str) {
  if (!str) return ''
  // Replace underscores and dashes with spaces
  let phrase = str.replace(/[_-]/g, ' ')
  // Capitalize each word
  phrase = phrase.replace(/\b\w/g, l => l.toUpperCase())
  // Special case: Bluetooth Le -> Bluetooth LE
  phrase = phrase.replace(/Bluetooth Le/gi, 'Bluetooth LE')
  phrase = phrase.replace(/ Mah/gi, ' mAh')
  return phrase
}

const defaultTermLinkMap = {
  rtk: '/terminology/positioning/rtk',
  gnss: '/terminology/positioning/gnss',
  "Wi-Fi AP scanning": '/terminology/positioning/wifi',
}

function linkTerms(text) {
  if (!text || typeof text !== 'string') return text
  const map = { ...defaultTermLinkMap, ...props.termLinkMap }
  // Sort keys by length desc to avoid partial matches (e.g., 'gps' inside other words)
  const keys = Object.keys(map).sort((a, b) => b.length - a.length)
  let out = text
  for (const key of keys) {
    const url = map[key]
    const re = new RegExp('\\b' + key.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&') + '\\b', 'gi')
    out = out.replace(re, match => `<a href="${url}" class="term-link">${match}</a>`)
  }
  return out
}

function linkUrls(text) {
  if (!text || typeof text !== 'string') return text
  // Simple URL regex (http/https). Keep it conservative.
  const urlRe = /https?:\/\/[^\s"'<>]+/g
  return text.replace(urlRe, url => `<a href="${url}" target="_blank" rel="noopener">${url}</a>`)
}

function formatValueForDisplay(val) {
  if (Array.isArray(val)) {
    // Array: join items, format each recursively
    return val.map(item => formatValueForDisplay(item)).join(', ')
  } else if (val && typeof val === 'object') {
    // Object: key-value pairs, each on a new line
    return Object.entries(val)
      .map(([k, v]) => `${normalizePhrase(k)}: ${formatValueForDisplay(v)}`)
      .join('<br>')
  } else {
    // Primitive
    return val
  }
}

watchEffect(() => {
  try {
    specs.value = yaml.load(props.yamlText)
    genericSections.value = []
    if (specs.value && specs.value.product) {
      const p = specs.value.product
      // Prefer the explicit prop if provided, otherwise derive from YAML
      if (props.deviceTitle) {
        deviceTitle.value = props.deviceTitle
      } else {
        deviceTitle.value = p.sku ? `${p.name} (${p.sku})` : p.name
      }
      // Main table (excluding sectionKeys)
      displaySpecs.value = {
        'Name': linkUrls(linkTerms(p.name)),
        'Version': p.version,
        'Serial prefix': p.prefix,
        'Connectivity': p.connectivity ? linkUrls(linkTerms(Object.keys(p.connectivity).join(', '))) : '',
        'Positioning': p.positioning ? linkUrls(linkTerms(Object.keys(p.positioning).join(', '))) : '',
        'Sensors': p.sensors ? linkUrls(linkTerms(Object.keys(p.sensors).join(', '))) : '',
      }
      // Generic section rendering
      for (const sectionKey of sectionKeys) {
        if (p[sectionKey]) {
          const subsections = []
          for (const [key, value] of Object.entries(p[sectionKey])) {
            const rows = []
            if (typeof value === 'object' && value !== null) {
              for (const [k, v] of Object.entries(value)) {
                let displayValue = v
                // Generic handling for object-of-objects with bands
                if (
                  typeof v === 'object' && v !== null && !Array.isArray(v)
                ) {
                  // Check if all values are objects with a single key/value (e.g., { L1: 1575.42 })
                  const entries = Object.entries(v)
                  if (
                    entries.length > 0 &&
                    entries.every(([, obj]) => obj && typeof obj === 'object' && Object.keys(obj).length === 1)
                  ) {
                    displayValue = entries.map(([outerKey, innerObj]) => {
                      const [innerKey, innerVal] = Object.entries(innerObj)[0]
                      let valStr
                      if (innerVal && typeof innerVal === 'object' && !Array.isArray(innerVal)) {
                        // Render as key (value), key2 (value2)
                        valStr = Object.entries(innerVal)
                          .map(([k, v]) => `${k} @ ${v}`)
                          .join(', ')
                      } else {
                        valStr = innerVal
                      }
                      return `${outerKey}: ${innerKey} (${valStr})`
                    }).join('<br>')
                  } else if (Array.isArray(v)) {
                    displayValue = v.map(item => typeof item === 'object' ? JSON.stringify(item) : item).join(', ')
                  } else {
                    displayValue = JSON.stringify(v)
                  }
                } else if (Array.isArray(v)) {
                  displayValue = v.map(item => typeof item === 'object' ? JSON.stringify(item) : item).join(', ')
                } else if (typeof v === 'object' && v !== null) {
                  // Render object as human-readable key-value pairs
                  displayValue = Object.entries(v)
                    .map(([objKey, objVal]) => {
                      if (Array.isArray(objVal)) {
                        return `${normalizePhrase(objKey)}: ${objVal.join(', ')}`
                      } else if (typeof objVal === 'object' && objVal !== null) {
                        // Nested object: flatten one level
                        return `${normalizePhrase(objKey)}: ` + Object.entries(objVal).map(([k, val]) => `${normalizePhrase(k)}: ${val}`).join(', ')
                      } else {
                        return `${normalizePhrase(objKey)}: ${objVal}`
                      }
                    })
                    .join('<br>')
                }
                displayValue = formatValueForDisplay(v)
                if (typeof displayValue === 'string') {
                  displayValue = linkTerms(displayValue)
                  displayValue = linkUrls(displayValue)
                }
                if (displayValue !== undefined && displayValue !== null && displayValue !== '' && displayValue !== '[]' && displayValue !== '{}') {
                  rows.push({ label: normalizePhrase(k), value: displayValue })
                }
              }
            } else if (value !== undefined && value !== null && value !== '') {
              rows.push({ label: normalizePhrase(key), value })
            }
            if (rows.length) {
              subsections.push({
                name: key,
                title: normalizePhrase(key),
                rows
              })
            }
          }
          if (subsections.length) {
            genericSections.value.push({
              name: sectionKey,
              title: normalizePhrase(sectionKey),
              subsections
            })
          }
        }
      }
    }
  } catch (e) {
    specs.value = null
    displaySpecs.value = {}
    deviceTitle.value = 'Device Specification'
    genericSections.value = []
  }
})

// Function to provide all data needed for PDF generation
function getPdfData() {
  // Use CORS proxy for images if needed
  const images = (specs.value?.product?.images || []).map(img =>
    img.startsWith('https://lightbug.io/')
      ? `https://cors-proxy.lightbug.workers.dev?url=${encodeURIComponent(img)}`
      : img
  );
  return {
    title: deviceTitle.value,
    description: specs.value?.product?.description || '',
    images,
    mainTable: displaySpecs.value,
    sections: genericSections.value.map(section => ({
      title: section.title,
      subsections: section.subsections.map(sub => ({
        title: sub.title,
        rows: sub.rows.map(row => ({
          label: row.label,
          value: row.value
        }))
      }))
    }))
  }
}
</script>

<style scoped>
.device-image-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1em;
  margin: 1em 0;
  max-width: 100%;
  justify-content: center;
}
.device-image {
  flex: 1 1 180px;
  max-width: 180px;
  min-width: 120px;
  width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  object-fit: contain;
}
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
h3 {
  margin-top: 2em;
}
h4 {
  margin-top: 1em;
}
.subsection-heading {
  background: #e0e7ef;
  font-weight: bold;
  text-align: left;
  font-size: 1em;
  padding: 10px 8px;
  border-bottom: 2px solid #bfc8d6;
}
.device-image-wrapper {
  text-align: center;
  margin: 1em 0;
}
.device-image {
  max-width: 220px;
  max-height: 220px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}
</style>
