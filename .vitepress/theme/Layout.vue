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
  '/devices/legacy': '/devices/history',
  '/devices/api/parse': '/devices/api/tools/parse',
  '/devices/api/generate': '/devices/api/tools/generate',
  '/apps/admin/creating-account': '/apps/admin/authentication#creating-an-account',
  '/apps/admin/permissions': '/apps/admin/authentication#permissions',
  '/devices/api/structure': '/devices/api/protocol',
  '/devices/api/headers': '/devices/api/protocol/headers',
})

watch(
  () => page.value.isNotFound,
  (isNotFound) => {
    if (!isNotFound || !inBrowser) return

    console.log('[Layout 404] Checking redirects for:', window.location.pathname)
    const redirect = redirects.find(([from]) => window.location.pathname.startsWith(from))

    if (!redirect) {
      console.log('[Layout 404] No redirect found for:', window.location.pathname)
      return
    }

    const newPath = redirect[1] + window.location.pathname.slice(redirect[0].length)
    const search = window.location.search
    const hash = window.location.hash
    const fullNewUrl = newPath + search + hash

    console.log('[Layout 404] Redirect found:', {
      from: redirect[0],
      to: redirect[1],
      originalPath: window.location.pathname,
      newPath,
      search,
      hash,
      fullNewUrl
    })

    go(fullNewUrl)
  },
  { immediate: true }
)
</script>

<template>
  <DefaultTheme.Layout />
</template>
