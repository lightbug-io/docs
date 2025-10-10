---
aside: false
outline: false
---

<script setup>
import Message from '../../../components/Protocol/Message.vue';
import ProtocolMessageConstants from '../../../components/ProtocolMessageConstants.vue'
import PayloadTable from '../../../components/PayloadTable.vue'
import { data as protocolData } from '../../../yaml-data.data.ts'
import { computed } from 'vue'

const messageId = 10008
const messageData = computed(() => protocolData?.messages?.[messageId])
const examples = computed(() => messageData.value?.examples || [])
</script>

# 10008: Base Page

<span v-if="messageData?.description" style="white-space: pre-line;">{{ messageData.description }}</span>

<PayloadTable :messageId="messageId" headerText="Payload" :yaml-data="protocolData"/>

<div v-if="examples.length > 0">

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

## Examples

<div v-for="(example, index) in examples" :key="index">

##### {{ example.name }}

<span v-if="example.description" style="white-space: pre-line;">{{ example.description }}</span>

<Message :byteString="example.bytes" :yaml-data="protocolData" :defaultCollapsed="false" :realDeviceInfo="example.real"/>


</div>

</div>

## Code

For convenience, the following constants can be referring to this message type.

<ProtocolMessageConstants :messageId="messageId" :yaml-data="protocolData"/>
