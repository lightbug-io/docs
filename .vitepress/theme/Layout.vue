<!-- .vitepress/theme/Layout.vue -->

<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import { inBrowser, useData, useRouter } from 'vitepress'
import { watch } from 'vue'

const { page } = useData()
const { go } = useRouter()

const redirects = Object.entries({
  '/silos': '/onprem',
})

watch(
  () => page.value.isNotFound,
  (isNotFound) => {
    if (!isNotFound || !inBrowser) return
    const redirect = redirects.find(([from]) => window.location.pathname.startsWith(from))
    if (!redirect) return
    go(redirect[1] + window.location.pathname.slice(redirect[0].length))
  },
  { immediate: true }
)
</script>

<template>
  <DefaultTheme.Layout />
</template>
