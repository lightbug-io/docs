---
aside: false
outline: false
---

<script setup>
import Message from '../../../components/Protocol/Message.vue';
import ProtocolMessageConstants from '../../../components/ProtocolMessageConstants.vue'
import PayloadTable from '../../../components/PayloadTable.vue'
import EinkText from '../../../components/EinkText.vue';
import { data as protocolData } from '../../../yaml-data.data.ts'
import { computed } from 'vue'

const messageId = 10009
const messageData = computed(() => protocolData?.messages?.[messageId])
const examples = computed(() => messageData.value?.examples || [])
</script>

::: danger ⚠️ Not yet public
The Device API currently in development and is not yet accessible on production devices.

These pages can be seen as a view of what is to come later this year.
:::

# 10009: Text Page

::: danger ⚠️ Recently altered
Redraw options have recently changed, and this page needs updating.
:::

<span v-if="messageData?.description" style="white-space: pre-line;">{{ messageData.description }}</span>

<PayloadTable :messageId="messageId" headerText="Payload" :yaml-data="protocolData"/>

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

<Message :byteString="example.bytes" :yaml-data="protocolData" :defaultCollapsed="true"/>

</div>

Only a partial redraw will be performed in order to add new lines, and the existing lines will remain on the screen.

## Code

For convenience, the following constants can be used to reference the payload fields.

<ProtocolMessageConstants :messageId="messageId" :yaml-data="protocolData"/>
