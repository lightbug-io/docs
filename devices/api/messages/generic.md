---
outline: [1,3]
---

<script setup>
import FancyBytes from '../../../components/FancyBytes.vue'
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

<FancyBytes
    byteString="3 17 0 5 0 0 0 2 0 1 2 1 32 1 234 176 65"
    :byteDefinition="[
        { pos: 0, len: 1, name: 'Message Meta', desc: 'Protocol', type: 'uint8', value: 3 },
        { pos: 1, len: 2, name: 'Message Meta', desc: 'Length', type: 'uint16', value: 17 },
        { pos: 3, len: 2, name: 'Message Meta', desc: 'Type', type: 'uint16', value: 5, bold: 1 },
        { pos: 5, len: 2, name: 'Header Meta', desc: 'Header Field Count', type: 'uint16', value: 0 },
        { pos: 7, len: 2, name: 'Payload Meta', desc: 'Payload Field Count', type: 'uint16', value: 2 },
        { pos: 9, len: 2, name: 'Payload Meta', desc: 'Payload Fields', type: '[]uint8', value: '1 2' },
        { pos: 11, len: 1, name: 'Payload 1', desc: 'ACKed message type (1) length', type: 'uint8', value: 1 },
        { pos: 12, len: 1, name: 'Payload 1', desc: 'ACKed message type (1) value', type: 'uint8', value: 32, bold: 1 },
        { pos: 13, len: 1, name: 'Payload 2', desc: 'ACKed message id (2) length', type: 'uint8', value: 1 },
        { pos: 14, len: 1, name: 'Payload 2', desc: 'ACKed message id (2) value', type: 'uint8', value: 234, bold: 1  },
        { pos: 15, len: 2, name: 'Message Meta', desc: 'Checksum', type: 'uint16', value: '176 65' },
    ]"
/>

If you do not receive an ACK for a message, you should assume that the message was not received.

## 6: KeepAlive

Used to keep a connection alive, and let the other side know that the connection is still active.

No data is required or expected.
