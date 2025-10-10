---
aside: false
outline: false
---

<script setup>
import Message from '../../../components/Protocol/Message.vue';
import ProtocolMessageConstants from '../../../components/ProtocolMessageConstants.vue'
import PayloadTable from '../../../components/PayloadTable.vue'
import HeaderTable from '../../../components/HeaderTable.vue'
import { data as protocolData } from '../../../yaml-data.data.ts'
import { computed } from 'vue'

const messageId = 5
const messageData = computed(() => protocolData?.messages?.[messageId])
const examples = computed(() => messageData.value?.examples || [])
</script>

# 5: ACK

<span v-if="messageData?.description" style="white-space: pre-line;">{{ messageData.description }}</span>

## Header

<HeaderTable :messageId="messageId" headerText="" :yaml-data="protocolData"/>

<small>This is an extract of header fields that are relevant to this message type, you can find them all documented in the [Headers](../protocol/headers.md) section.
</small>

## Payload

<PayloadTable :messageId="messageId" headerText="" :yaml-data="protocolData"/>

## Examples

<div v-for="(example, index) in examples" :key="index">

##### {{ example.name }}

<Message :byteString="example.bytes" :yaml-data="protocolData" :defaultCollapsed="false" :realDeviceInfo="example.real"/>

</div>

## Sequence

##### Simple ACK

The simple case is that a sender sends a message, and the receiver responds with an ACK message.

```mermaid
flowchart LR
    A[Sender] -->|Message type 123| B(Receiver)
    B -->|ACK typ 5| A
```

##### Response

The [Response Message ID](../protocol/headers#_3-response-message-id) field in the header can be used in place of an ACK if an immediate response is being sent, with a specific message type.

In such cases the response will not have an ACK message type, instead it will have the message type of the response (often the same as the request).

```mermaid
flowchart LR
    A[Sender] -->|Message type 123| B(Receiver)
    B -->|Response type 123| A
```

##### Retries

If a sender does not receive an ACK or response, it may resend the message.

```mermaid
flowchart LR
    A[Sender] -->|Message id 56| B(Receiver)
    A[Sender] -->|Message id 56| B(Receiver)
```

## Code

For convenience, the following constants can be used to reference the payload fields.

<ProtocolMessageConstants :messageId="messageId" :yaml-data="protocolData"/>
