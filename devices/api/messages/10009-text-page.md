---
aside: false
outline: false
---

<script setup>
import Message from '../../../components/Protocol/Message.vue';
import PayloadSection from '../../../components/Protocol/PayloadSection.vue';
import CodeSection from '../../../components/Protocol/CodeSection.vue';
import EinkText from '../../../components/EinkText.vue';
import { data as protocolData } from '../../../yaml-data.data.ts'
import { computed } from 'vue'

const messageId = 10009
const messageData = computed(() => protocolData?.messages?.[messageId])
const examples = computed(() => messageData.value?.examples || [])
</script>

# 10009: Text Page

<span v-if="messageData?.description" style="white-space: pre-line;">{{ messageData.description }}</span>

<PayloadSection :messageId="messageId" :yamlData="protocolData" />

## Pages

This is what the text pages actually look like.

### Default font



## Examples

<!--
<EinkText
title="Page Title"
line1="First Line"
line2="Second Line"
line3="Third"
/>
-->

<div v-for="(example, index) in examples" :key="index">

##### {{ example.name }}

<span v-if="example.description" style="white-space: pre-line;">{{ example.description }}</span>

<!--
<EinkText
title="Page Title"
line1="First Line"
line2="Second Line"
line3="Third"
v-if="index === 0"
/>

<EinkText
title="Page Title"
line1="First Line"
line2="Second Line"
line3="Third"
line4="4th"
v-if="index === 1"
/>
-->

<Message :byteString="example.bytes" :yaml-data="protocolData" :defaultCollapsed="false" :realDeviceInfo="example.real"/>
</div>

Only a partial redraw will be performed in order to add new lines, and the existing lines will remain on the screen.

<CodeSection :messageId="messageId" :yamlData="protocolData" />
