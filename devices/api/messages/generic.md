---
outline: [1,3]
---

<script setup>
import ProtocolBytes from '../../../components/ProtocolBytes.vue'
</script>

# Generic

Message types that can be used in a variety of situations.

## 5: ACK

Used to acknowledge a previously sent message.

There are 2 fields in the payload

| Field | Name               | Description                         | Type |
| ----- | ------------------ | ----------------------------------- | ---- |
| 1     | ACKed message type | Type of message that is being ACKed |  uint16    |
| 2     | ACKed message ID   | ID if the message that is being ACKed, if previously provided. | uintn |

An example ACK message, acknowledging a message with type 32 and ID 234 would be as follows:

<ProtocolBytes
byteString="3 17 0 5 0 0 0 2 0 1 2 1 32 1 234 176 65"
:boldPositions="[3,12,14]"
></ProtocolBytes>

If you do not receive an ACK for a message, you should assume that the message was not received.

## 6: KeepAlive

Used to keep a connection alive, and let the other side know that the connection is still active.

No data is required or expected.
