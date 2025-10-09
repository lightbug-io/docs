import yaml from 'js-yaml'
import { ref } from 'vue'

// loadSpec: parse raw YAML string and return a ref containing the parsed object or null
export function loadSpec(raw) {
  const specs = ref(null)
  try {
    specs.value = yaml.load(raw)
  } catch (e) {
    // swallow parse errors; keep specs null
    specs.value = null
    // For debugging, it's fine to console.warn here (caller can opt-in)
    console.warn('loadSpec: failed to parse yaml', e)
  }
  return specs
}

export default loadSpec
