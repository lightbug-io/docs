---
outline: [1,3]
---

<script setup>
import GenerateConsts from '../../components/GenerateConsts.vue'
</script>

::: danger ⚠️ Not yet public
The Device API currently in development and is not yet accessible on production devices.

These pages can be seen as a view of what is to come later this year.
:::

# Headers

These header field types are reserved across all message types.

<GenerateConsts :prefix="'MH_'" :enumName="'MH'" :dataPath="'header'"/>

## 1: Message ID

Used to identify the message.

Can be one of uint8, uint16, uint32, or uint64, as Little Endian.

Should be used with ACK messages to identify the message that is being ACKed.

ACKs should return the same message ID and type as the message being ACKed.

## 2: Client ID

Used to identify the client that sent the message where appropriate.

## 3: Response Message ID

This message is responding to a previous message with the specified message ID.

Should be the same message ID and type as the message being responded to.

## 4: Message Status

The status of the response.

 - 1: OK
 - 2: NOT OK

## 5: Method

- 1: Set, Request a change, using the data provided.
- 2: Get, Request the current value or values.
- 3: Subscribe, Request to be notified of changes to the value or values.
- 4: Do, Perform an action, using the data provided.

## 10: Forwarded For
## 11: Forwarded RSSI
## 12: Forwarded SNR
## 13: Forwarded Type
