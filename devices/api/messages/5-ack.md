---
aside: false
outline: false
---

<script setup>
import HeaderSection from '../../../components/Protocol/HeaderSection.vue';
import PayloadSection from '../../../components/Protocol/PayloadSection.vue';
import ExamplesSection from '../../../components/Protocol/ExamplesSection.vue';
import CodeSection from '../../../components/Protocol/CodeSection.vue';
import { data as protocolData } from '../../../yaml-data.data.ts'
import { computed } from 'vue'

const messageId = 5
const messageData = computed(() => protocolData?.messages?.[messageId])
</script>

# 5: ACK

<span v-if="messageData?.description" style="white-space: pre-line;">{{ messageData.description }}</span>

## Lightbug comms

This applies to Lightbug devices, SDKs, apps and services.

 - ACKs will be sent when a message has an ID in the header field.
 - If an ID is not present, then no ACK will be sent because it is assumed the sender is not tracking successes/failures.
 - ACKs may always be sent for open and close messages (with type only) <!-- Currently the case for P1 comms-->

<HeaderSection :messageId="messageId" :yamlData="protocolData" />

<PayloadSection :messageId="messageId" :yamlData="protocolData" />

<ExamplesSection :messageId="messageId" :yamlData="protocolData" />

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

<CodeSection :messageId="messageId" :yamlData="protocolData" />
