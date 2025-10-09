---
aside: false
---

<script setup>
import DeviceSpecTable from '../../../components/DeviceSpecTable.vue'
import spec from '../../../public/device-specs/rtk/v2.yaml?raw'
</script>

<DeviceSpecTable :yamlText="spec" deviceTitle="Handheld RTK (RH2)" />
