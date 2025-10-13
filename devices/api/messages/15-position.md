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

const messageId = 15
const messageData = computed(() => protocolData?.messages?.[messageId])
const examples = computed(() => messageData.value?.examples || [])
</script>

# 15: Position


<span v-if="messageData?.description" style="white-space: pre-line;">{{ messageData.description }}</span>

Used to interact with the devices position.

<PayloadTable :messageId="messageId" headerText="Payload" :yaml-data="protocolData"/>

<div v-if="examples.length > 0">

## Examples

<div v-for="(example, index) in examples" :key="index">

##### {{ example.name }}

<span v-if="example.description" style="white-space: pre-line;">{{ example.description }}</span>

<Message :byteString="example.bytes" :yaml-data="protocolData" :defaultCollapsed="false" :realDeviceInfo="example.real"/>


</div>

</div>

## Code

For convenience, the following constants can be used to reference the payload fields.

<MessageCodeGen :messageId="messageId" :yaml-data="protocolData"/>
