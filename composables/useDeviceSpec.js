import { ref, watchEffect } from 'vue'
import yaml from 'js-yaml'

// An allowed list of keys to use from the YAML for now.. (and order)
const sectionKeys = ['physical','integrations','user interface','connectivity','positioning','sensors','battery','charging','components']

const defaultTermLinkMap = {
  rtk: '/terminology/positioning/rtk',
  gnss: '/terminology/positioning/gnss',
  "Wi-Fi AP scanning": '/terminology/positioning/wifi',
}

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

function linkTerms(text, termLinkMap = {}) {
  if (!text || typeof text !== 'string') return text
  const map = { ...defaultTermLinkMap, ...termLinkMap }
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

function processSpecDataFromObject(specs, termLinkMap = {}) {
  const displaySpecs = {}
  let deviceTitle = 'Device Specification'
  const genericSections = []

  if (specs && specs.product) {
    const p = specs.product
    deviceTitle = p.sku ? `${p.name} (${p.sku})` : p.name

    // Main table (excluding sectionKeys)
    displaySpecs['Name'] = linkUrls(linkTerms(p.name, termLinkMap))
    displaySpecs['Version'] = p.version
    displaySpecs['SKU'] = p.sku ? linkUrls(linkTerms(p.sku, termLinkMap)) : ''
    displaySpecs['Serial prefix'] = p.prefix
    displaySpecs['Connectivity'] = p.connectivity ? linkUrls(linkTerms(Object.keys(p.connectivity).join(', '), termLinkMap)) : ''
    displaySpecs['Positioning'] = p.positioning ? linkUrls(linkTerms(Object.keys(p.positioning).join(', '), termLinkMap)) : ''
    displaySpecs['Sensors'] = p.sensors ? linkUrls(linkTerms(Object.keys(p.sensors).join(', '), termLinkMap)) : ''

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
                displayValue = linkTerms(displayValue, termLinkMap)
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
          genericSections.push({
            name: sectionKey,
            title: normalizePhrase(sectionKey),
            subsections
          })
        }
      }
    }
  }

  return {
    specs,
    displaySpecs,
    deviceTitle,
    genericSections
  }
}

export function useDeviceSpec(specOrYaml, options = {}) {
  const specs = ref(null)
  const displaySpecs = ref({})
  const deviceTitle = ref('Device Specification')
  const genericSections = ref([])

  const { termLinkMap = {} } = options

  watchEffect(() => {
    // Handle both ref objects and raw values
    const input = specOrYaml.value || specOrYaml

    // If input is already a parsed object (has .product property), use it directly
    let parsedSpec
    if (input && typeof input === 'object' && input.product) {
      parsedSpec = input
    } else if (typeof input === 'string') {
      // Parse YAML string
      try {
        parsedSpec = yaml.load(input)
      } catch (e) {
        console.error('Error parsing YAML:', e)
        parsedSpec = null
      }
    } else {
      parsedSpec = null
    }

    // Process the spec data
    if (parsedSpec) {
      const result = processSpecDataFromObject(parsedSpec, termLinkMap)
      specs.value = result.specs
      displaySpecs.value = result.displaySpecs
      deviceTitle.value = result.deviceTitle
      genericSections.value = result.genericSections
    } else {
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
      img.startsWith('https://lightbug.io/') || img.startsWith('https://lightbug.cloud/') || img.startsWith('https://upload.r2.lb.chasm.cloud/')
        ? `https://cors-proxy.lightbug.workers.dev?url=${encodeURIComponent(img)}`
        : img
    )
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

  return {
    specs,
    displaySpecs,
    deviceTitle,
    genericSections,
    getPdfData
  }
}
