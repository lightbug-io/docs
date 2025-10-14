---
aside: false
outline: false
---

<script setup>
import { data as protocolData } from '../../../yaml-data.data.ts'
import { computed } from 'vue'
import { useMessageSections } from '../../../composables/useMessageSections.js'

const messageId = 10008
const messageData = computed(() => protocolData?.messages?.[messageId])
const { hasPayload, hasExamples } = useMessageSections(messageId, protocolData)
</script>

# 10008: Base Page

<span v-if="messageData?.description" style="white-space: pre-line;">{{ messageData.description }}</span>

<template v-if="hasPayload">

## Payload

<PayloadSection :messageId="messageId" :yamlData="protocolData" />

</template>

## Pages

This is what the base pages actually look like.

### 1: Home page

#### RH2

:::tabs
== Visualization
![=400x](https://upload.r2.lb.chasm.cloud/2025/10/imgur/lGxzg9U.png){.center}
== Wide Photo
![=600x](https://upload.r2.lb.chasm.cloud/2025/10/imgur/dF5X5Qn.png){.center}
== Zoom Photo
![=400x](https://upload.r2.lb.chasm.cloud/2025/10/imgur/42e4q6P.jpeg){.center}
:::

<template v-if="hasExamples">

## Examples

<ExamplesSection :messageId="messageId" :yamlData="protocolData" />

</template>

## Code

<CodeSection :messageId="messageId" :yamlData="protocolData" />
