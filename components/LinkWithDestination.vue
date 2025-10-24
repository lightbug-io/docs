<template>
  <a :href="href" :class="['link-with-destination', isExternal ? 'external' : 'internal']">
    <span class="link-label">{{ label }}</span>
    <span class="destination-chip" v-if="destinationType">{{ destinationType }}</span>
  </a>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  href: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  destination: {
    type: String,
    default: null
  }
})

const isExternal = computed(() => {
  return props.href.startsWith('http')
})

const destinationType = computed(() => {
  if (props.destination) {
    return props.destination
  }

  return ''
})
</script>

<style scoped>
.link-with-destination {
  display: inline-flex;
  align-items: center;
  gap: 0.25em;
  text-decoration: none;
}


.link-label {
  text-decoration: underline;
}

.destination-chip {
  align-items: center;
  background: #fc7c3d;
  color: white;
  padding: 0em 0.2em;
  font-size: 0.7em;
  font-weight: 600;
  text-transform: lowercase;
  line-height: 2;
  border-radius: 0.25em;
}


</style>
