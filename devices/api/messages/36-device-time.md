---
aside: false
outline: false
---

<script setup>
import Message from '../../../components/Protocol/Message.vue';
import MessageCodeGen from '../../../components/Protocol/MessageCodeGen.vue'
import PayloadTable from '../../../components/PayloadTable.vue'
import { data as protocolData } from '../../../yaml-data.data.ts'
import { computed } from 'vue'

const messageId = 36
const messageData = computed(() => protocolData?.messages?.[messageId])
const examples = computed(() => messageData.value?.examples || [])
</script>

# 36: Device Time

<span v-if="messageData?.description" style="white-space: pre-line;">{{ messageData.description }}</span>

<PayloadTable :messageId="messageId" headerText="Payload" :yaml-data="protocolData"/>

::: warning ⚠️ Possible future change
We are considering changing the unix time to be in milliseconds instead of seconds.

This would allow for more precise timekeeping, especially when combined with GNSS time.

This may happen in a future firmware update.
:::

<div v-if="examples.length > 0">

## Examples

<div v-for="(example, index) in examples" :key="index">

##### {{ example.name }}

<span v-if="example.description" style="white-space: pre-line;">{{ example.description }}</span>

<Message :byteString="example.bytes" :yaml-data="protocolData" :defaultCollapsed="false" :realDeviceInfo="example.real"/>


</div>

</div>

## Code

For convenience, the following constants can be referring to this message type.

<MessageCodeGen :messageId="messageId" :yaml-data="protocolData"/>
