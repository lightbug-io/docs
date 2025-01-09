---
aside: false
outline: false
---

<script setup>
import ProtocolBytes from '../../../components/ProtocolBytes.vue';
import SplitColumnView from '../../../components/SplitColumnView.vue';
import GenerateConsts from '../../../components/GenerateConsts.vue'
</script>

# 5: ACK

<SplitColumnView>
<template #left>

Used to acknowledge a previously sent message.

## Payload

| Field | Name               | Description                         | Type |
| ----- | ------------------ | ----------------------------------- | ---- |
| 1     | ACKed message type | Type of message that is being ACKed | uint16 |
| 2     | ACKed message ID   | ID of the message that is being ACKed, if previously provided. | uintn |

### Details

ACKs are not always required for communication, but can be useful for ensuring that messages are received.

The [Response Message ID](./../headers#_3-response-message-id) field in the header can be used in place of an ACK if an immediate response is being sent.

All messages should send a response, or ACK, in response to a message, so that the sender knows that the message was received.
Otherwise resends may occur.

</template>
<template #right>

### Example
ACK message, acknowledging a message with type `32` and ID `234`

<ProtocolBytes
    byteString="3 17 0 5 0 0 0 2 0 1 2 1 32 1 234 176 65"
    :boldPositions="[3,12,14]"
    :allowCollapse="false"
/>

</template>
</SplitColumnView>

## Code

For convenience, the following constants can be used to reference the payload fields.

<GenerateConsts :prefix="'MD_ACK_'" :enumName="'MD_ACK'" :dataPath="'messages/5/data'"/>
