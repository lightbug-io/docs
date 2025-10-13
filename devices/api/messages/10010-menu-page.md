---
aside: false
outline: false
---

<script setup>
import PayloadSection from '../../../components/Protocol/PayloadSection.vue';
import ExamplesSection from '../../../components/Protocol/ExamplesSection.vue';
import CodeSection from '../../../components/Protocol/CodeSection.vue';
import { data as protocolData } from '../../../yaml-data.data.ts'
import { computed } from 'vue'

const messageId = 10010
const messageData = computed(() => protocolData?.messages?.[messageId])
</script>

::: danger ⚠️ Not yet public
The Device API currently in development and is not yet accessible on production devices.

These pages can be seen as a view of what is to come later this year.
:::

# 10010: Menu Page

<span v-if="messageData?.description" style="white-space: pre-line;">{{ messageData.description }}</span>

## Payload

<PayloadSection :messageId="messageId" :yamlData="protocolData" />

## Examples

<ExamplesSection :messageId="messageId" :yamlData="protocolData" />

## Code

<CodeSection :messageId="messageId" :yamlData="protocolData" />
