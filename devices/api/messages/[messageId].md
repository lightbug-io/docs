---
aside: false
outline: false
title: {{ $params.pageTitle }}
---

<script setup>
import HeaderSection from '../../../components/Protocol/HeaderSection.vue';
import PayloadSection from '../../../components/Protocol/PayloadSection.vue';
import ExamplesSection from '../../../components/Protocol/ExamplesSection.vue';
import CodeSection from '../../../components/Protocol/CodeSection.vue';
import { data as protocolData } from '../../../yaml-data.data.ts'
import { computed } from 'vue'
import { useRoute,useData } from 'vitepress'

const route = useRoute()
const { frontmatter } = useData()
// Extract numeric ID from "12-close" format
const messageId = parseInt(route.data.params.messageId.split('-')[0])
const messageData = computed(() => protocolData?.messages?.[messageId])

// Use the pageTitle from params if available, otherwise construct it
const pageTitle = computed(() => route.data.params.pageTitle || `${messageId}: ${messageData.value?.name || ''}`)

// Update the document title
if (typeof document !== 'undefined' && pageTitle.value) {
  document.title = `${pageTitle.value} | Lightbug Documentation`
}
</script>

# {{ messageId }}: {{ messageData?.name }}

<span v-if="messageData?.description" style="white-space: pre-line;">{{ messageData.description }}</span>

## Header

<HeaderSection :messageId="messageId" :yamlData="protocolData" />

## Payload

<PayloadSection :messageId="messageId" :yamlData="protocolData" />

## Examples

<ExamplesSection :messageId="messageId" :yamlData="protocolData" />

## Code

<CodeSection :messageId="messageId" :yamlData="protocolData" />
