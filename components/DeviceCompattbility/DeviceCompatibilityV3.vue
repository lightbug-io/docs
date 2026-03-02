<template>
  <DeviceCompatibility :devices="devices" description="V3 messaging protocol" :float="float" :fullWidth="fullWidth" />
</template>

<script setup>
import DeviceCompatibility from './DeviceCompatibility.vue'

const props = defineProps({
  float: {
    type: String,
    default: null
  },
  fullWidth: {
    type: Boolean,
    default: false
  }
})

const devices = [
  { id: 'rtk', name: 'RTK', link: '/devices/rtk/' },
  { id: 'viper', name: 'Viper' },
  { id: 'ble-gateways', name: 'BLE Gateways' },
  { id: 'zcard', name: 'ZCard' }
]
</script>
