<!-- .vitepress/theme/Layout.vue -->

<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import { inBrowser, useData, useRouter } from 'vitepress'
import { watch } from 'vue'

const { page } = useData()
const { go } = useRouter()

const redirects = Object.entries({
  '/silos': '/onprem',
  '/terminology': '/terminology',
  '/guides/troubleshooting': '/faq/troubleshooting',
  '/devices/api/parse': '/devices/api/tools/parse',
  '/devices/api/generate': '/devices/api/tools/generate'
})

watch(
  () => page.value.isNotFound,
  (isNotFound) => {
    if (!isNotFound || !inBrowser) return
    const redirect = redirects.find(([from]) => window.location.pathname.startsWith(from))
    if (!redirect) return
    const newPath = redirect[1] + window.location.pathname.slice(redirect[0].length)
    const search = window.location.search
    const hash = window.location.hash
    go(newPath + search + hash)
  },
  { immediate: true }
)
</script>

<template>
  <DefaultTheme.Layout />
</template>
