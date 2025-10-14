---
outline: deep
---

<script setup>
import { data as protocolData } from '../../../yaml-data.data.ts'
</script>

# Examples

Here are some example messages for various scenarios, to help you visualize how the protocol works.

## Basic type 3 message

Ignoring what type of message type 3 is, this example slowly builds from an empty message to one with various headers and data.

### empty

A message that only has a type, no headers, and no payload.

<Message
    byteString="3 11 0 1 0 0 0 0 0 75 190"
></Message>

### with prefix bytes

Adding the options [prefix bytes](./prefix.md) to the start of the message.

<Message
    byteString="76 66 3 11 0 1 0 0 0 0 0 75 190"
:yaml-data="protocolData"
></Message>

### with single uint32 header

<Message
    byteString="76 66 3 17 0 1 0 1 0 1 4 22 0 0 0 0 0 243 35"
:yaml-data="protocolData"
></Message>

### with single ascii payload

<Message
    byteString="76 66 3 24 0 1 0 1 0 1 4 22 0 0 0 1 0 26 5 104 101 108 108 111 221 92"
:yaml-data="protocolData"
></Message>

### with multiple headers and payloads

<Message
    byteString="76 66 3 33 0 1 0 2 0 1 99 4 22 0 0 0 4 108 98 108 98 2 0 26 27 5 104 101 108 108 111 1 7 183 242"
:yaml-data="protocolData"
></Message>

## Real world

### Ack

From the [ACK message](./../messages/5-ack)

<ExamplesSection :messageId="5" :yamlData="protocolData" hideHeaders=true maxExamples=1 />

### Position

From the [Position message](./../messages/15-position)

<ExamplesSection :messageId="15" :yamlData="protocolData" hideHeaders=true maxExamples=1 />
