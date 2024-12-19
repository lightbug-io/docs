---
outline: [1,3]
---

<script setup>
import ProtocolHeaders from '../../components/ProtocolHeaders.vue'
import GenerateConsts from '../../components/GenerateConsts.vue'
</script>

# Headers

These header values keys are reserved across all message types.

<ProtocolHeaders/>

## 1: Message ID

Used to identify the message.

Messages that are chunked will have the same message ID for all chunks.

Can be used with ACK messages to identify the message that is being ACKed.

## 2: Client ID

Used to identify the client that sent the message where appropriate.

## 3: Response Message ID

This message is responding to a previous message with the specified message ID.

## 4: Message Status

The status of the response.

 - 1: OK
 - 2: NOT OK

## 5: Method

- 1: Set, Request a change, using the data provided.
- 2: Get, Request the current value.
- 3: Subscribe, Request to be notified of changes.

## 10: Forwarded For
## 11: Forwarded RSSI
## 12: Forwarded SNR
## 13: Forwarded Type
