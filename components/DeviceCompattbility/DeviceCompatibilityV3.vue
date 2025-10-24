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
  { id: 'rtk-handheld', name: 'Handheld RTK', link: '/devices/rtk/handheld/' },
  { id: 'rtk-vehicle', name: 'Vehicle RTK', link: '/devices/rtk/vehicle' },
  { id: 'viper', name: 'Viper' },
  { id: 'zcard', name: 'ZCard' }
]
</script>
