---
aside: false
---

<script setup>
import DeviceSpecTable from '../../components/DeviceSpecTable.vue'
import { ref, onMounted } from 'vue'

const yamlText = ref('')

onMounted(async () => {
  const res = await fetch('/device-specs/pro/v2.yaml')
  yamlText.value = await res.text()
})
</script>

<DeviceSpecTable v-if="yamlText" :yaml-text="yamlText" />

## Charging

The Pro tracker is charged using a USB-C connector, and should be charged for 8 hours before initial use.

| State | Indication |
|---|---|
| Disconnected | No LED will be on |
| Connected, Charging | LED will pulse red |
| Connected, Fully charged | LED will be solid green |

::: warning
It is advised to use an adapter plugged into a power socket rather than using a computer USB port or similar.
:::
