<!-- .vitepress/theme/Layout.vue -->

<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import Consent from './Consent.vue'
import { inBrowser, useData, useRouter } from 'vitepress'
import { watch } from 'vue'
import { resolveLegacyRedirect } from '../../utils/LegacyRedirect'

const { page, site } = useData()
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

    const destination = resolveLegacyRedirect(
      window.location.pathname,
      window.location.search,
      window.location.hash,
      site.value.base,
      redirects,
    )
    if (destination) go(destination)
  },
  { immediate: true }
)
</script>

<template>
  <DefaultTheme.Layout>
    <template #layout-bottom><Consent /></template>
  </DefaultTheme.Layout>
</template>
