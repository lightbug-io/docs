---
aside: false
outline: false
---

<script setup>
import ProtocolBytes2 from '../../../components/ProtocolBytes2.vue';
import ProtocolMessageConstants from '../../../components/ProtocolMessageConstants.vue'
import PayloadTable from '../../../components/PayloadTable.vue'
import { data as protocolData } from '../../../yaml-data.data.ts'
import { computed } from 'vue'

const messageId = 13
const messageData = computed(() => protocolData?.messages?.[messageId])
const examples = computed(() => messageData.value?.examples || [])
</script>

# 13: Heartbeat

<span v-if="messageData?.description" style="white-space: pre-line;">{{ messageData.description }}</span>

<PayloadTable :messageId="messageId" headerText="Payload" :yaml-data="protocolData"/>

## Examples

<div v-for="(example, index) in examples" :key="index">

##### {{ example.name }}

<span v-if="example.description" style="white-space: pre-line;">{{ example.description }}</span>

<ProtocolBytes2 :byteString="example.bytes" :yaml-data="protocolData" :defaultCollapsed="false" :realDeviceInfo="example.real"/>

</div>

## Code

For convenience, the following constants can be referring to this message type.

<ProtocolMessageConstants :messageId="messageId" :yaml-data="protocolData"/>
