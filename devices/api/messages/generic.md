---
aside: false
outline: false
---

<script setup>
import ProtocolBytes from '../../../components/ProtocolBytes.vue'
</script>

# Generic

Message types that can be used in a variety of situations.

## 5: ACK

<v-row no-gutters>
<v-col cols="12" sm="6" >
<v-sheet>

Used to acknowledge a previously sent message.

## Payload

| Field | Name               | Description                         | Type |
| ----- | ------------------ | ----------------------------------- | ---- |
| 1     | ACKed message type | Type of message that is being ACKed |  uint16    |
| 2     | ACKed message ID   | ID of the message that is being ACKed, if previously provided. | uintn |

### Details

ACKs are not always required for communication, but can be useful for ensuring that messages are received.

The [Response Message ID](./../headers#_3-response-message-id) field in the header can be used in place of an ACK if an immediate response is being sent.

All messages should send a response, or ACK, in response to a message, so that the sender knows that the message was received.
Otherwise resends may occur.

</v-sheet>
</v-col>

<v-col cols="12" sm="6" >
<v-sheet class="ma-2 pa-2">

### Example
ACK message, acknowledging a message with type `32` and ID `234`
<ProtocolBytes
    byteString="3 17 0 5 0 0 0 2 0 1 2 1 32 1 234 176 65"
    :boldPositions="[3,12,14]"
></ProtocolBytes>

</v-sheet>
</v-col>
</v-row>

## 6: KeepAlive

<v-row no-gutters>
<v-col cols="12" sm="6" >
<v-sheet>
Used to keep a connection alive, and let the other side know that the connection is still active.

### Payload

Not required.

</v-sheet>
</v-col>

<v-col cols="12" sm="6" >
<v-sheet class="ma-2 pa-2">

### Example
KeepAlive with no headers or payload
<ProtocolBytes
    byteString="76 66 3 11 0 6 0 0 0 0 0 10 118"
    :boldPositions="[3]"
></ProtocolBytes>

</v-sheet>
</v-col>
</v-row>
