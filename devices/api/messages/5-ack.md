---
aside: true
outline: deep
---

<script setup>
import { data as protocolData } from '../../../yaml-data.data.ts'
import { computed } from 'vue'
import { useMessageSections } from '../../../composables/useMessageSections.js'

const messageId = 5
const messageData = computed(() => protocolData?.messages?.[messageId])
const { hasHeader, hasPayload, hasExamples } = useMessageSections(messageId, protocolData)
</script>

# 5: ACK

<span v-if="messageData?.description" style="white-space: pre-line;">{{ messageData.description }}</span>

<span id="lightbug-comms"></span>

## Response conventions

See [Responses and acknowledgments](../protocol/responses) for correlation, Status, typed replies and when an ACK is sent. In particular, omitting Message ID does not guarantee that no error ACK or typed response will be sent. This page defines the MT5 packet format.

<template v-if="hasHeader">

## Header

<HeaderSection :messageId="messageId" :yamlData="protocolData" />

</template>

<template v-if="hasPayload">

## Payload

<PayloadSection :messageId="messageId" :yamlData="protocolData" />

</template>

<template v-if="hasExamples">

## Examples

<ExamplesSection :messageId="messageId" :yamlData="protocolData" />

</template>

## Sequence

##### Simple ACK

The simple case is that a sender sends a message, and the receiver responds with an ACK message.

```mermaid
flowchart LR
    A[Sender] -->|Message type 123| B(Receiver)
    B -->|ACK typ 5| A
```

##### Response

An immediate typed response can replace a separate ACK. Its [Response to header](../protocol/headers#3-response-to) correlates it with the request when a nonzero Message ID was supplied.

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

<CodeSection :messageId="messageId" :yamlData="protocolData" />
