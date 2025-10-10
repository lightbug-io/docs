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

const messageId = 15
const messageData = computed(() => protocolData?.messages?.[messageId])
const examples = computed(() => messageData.value?.examples || [])
</script>

::: danger ⚠️ Not yet public
The Device API currently in development and is not yet accessible on production devices.

These pages can be seen as a view of what is to come later this year.
:::

# 15: Position

::: danger Not yet documented
:::

<span v-if="messageData?.description" style="white-space: pre-line;">{{ messageData.description }}</span>

Used to interact with the devices position.

<PayloadTable :messageId="messageId" headerText="Payload" :yaml-data="protocolData"/>

<div v-if="examples.length > 0">

## Examples

<div v-for="(example, index) in examples" :key="index">

##### {{ example.name }}

<Message :byteString="example.bytes" :yaml-data="protocolData" :defaultCollapsed="false"/>

</div>

</div>

## Code

For convenience, the following constants can be used to reference the payload fields.

<ProtocolMessageConstants :messageId="messageId" :yaml-data="protocolData"/>
