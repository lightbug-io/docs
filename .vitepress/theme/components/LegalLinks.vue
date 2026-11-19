<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { parseLegalManifest, type LegalDocument } from '../../../utils/LegalDocuments'

const documents = ref<LegalDocument[]>([])
const abort = new AbortController()

onMounted(async () => {
  const endpoint = import.meta.env.VITE_LIGHTBUG_LEGAL_MANIFEST_URL
  if (!endpoint) return
  try {
    const url = new URL(endpoint)
    if (url.protocol !== 'https:' || url.username || url.password || url.hash) return
    const response = await fetch(url.href, {
      cache: 'no-store', credentials: 'omit', signal: abort.signal,
    })
    if (!response.ok) return
    documents.value = parseLegalManifest(await response.json()).documents
  } catch {
    documents.value = []
  }
})
onBeforeUnmount(() => abort.abort())
</script>

<template>
  <nav v-if="documents.length" class="legal-links" aria-label="Legal documents">
    <a v-for="document in documents" :key="document.id" :href="document.url"
       target="_blank" rel="noopener noreferrer">
      {{ document.title }} ({{ document.version }})
    </a>
  </nav>
</template>

<style scoped>
.legal-links {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
  padding: 1rem;
  border-top: 1px solid var(--vp-c-divider);
  font-size: 0.9rem;
}
.legal-links a { color: var(--vp-c-brand-1); }
</style>
