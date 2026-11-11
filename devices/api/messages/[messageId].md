---
aside: false
outline: false
---

<script setup>
import { data as protocolData } from '../../../yaml-data.data.ts'
import { computed } from 'vue'
import { useRoute } from 'vitepress'
import { useMessageSections } from '../../../composables/useMessageSections.js'
import { getMessageDocumentation } from '../../../utils/MessageDocumentation'
import StructuredMessagePage from '../../../components/Protocol/StructuredMessagePage.vue'

const route = useRoute()
// Extract numeric ID from "12-close" format
const messageId = computed(() => parseInt((route.data.params?.messageId || '').split('-')[0]))
const messageData = computed(() => protocolData?.messages?.[messageId.value])
const structuredDocumentation = computed(() => getMessageDocumentation(messageData.value))

// The legacy composable takes a numeric ID; re-create its view when the route changes.
const sections = computed(() => useMessageSections(messageId.value, protocolData))
const hasHeader = computed(() => sections.value.hasHeader.value)
const hasPayload = computed(() => sections.value.hasPayload.value)
const hasExamples = computed(() => sections.value.hasExamples.value)

const isAlpha = computed(() => {
  return messageData.value?.alpha
})

const alphaText = computed(() => {
  return messageData.value?.alpha
})
</script>

<span id="messageid-messagedata-name"></span>

<!-- @content -->

<template v-if="isAlpha">

:::alpha
{{ alphaText }}
:::

</template>

<StructuredMessagePage v-if="structuredDocumentation" :key="messageId" :message-id="messageId" :yaml-data="protocolData" />

<template v-else :key="messageId">

<span v-if="messageData?.description" style="white-space: pre-line;">{{ messageData.description }}</span>

<template v-if="hasHeader">

## Header

<HeaderSection :messageId="messageId" :yamlData="protocolData" />

</template>

<template v-if="hasPayload">

## Payload

<PayloadSection :messageId="messageId" :yamlData="protocolData" />

</template>

<template v-if="hasExamples">

## Examples

<ExamplesSection :messageId="messageId" :yamlData="protocolData" />

</template>

## Code

<CodeSection :messageId="messageId" :yamlData="protocolData" />

</template>
