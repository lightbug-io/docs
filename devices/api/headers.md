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

<GenerateConsts :dataName="'MH'" :dataPath="'header'"/>

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

 - 0: OK
 - 1: NOT OK (Generic error)
 - 3: Method not supported
 - 4: Invalid payload param
 - 5: Invalid state
 - 6: No data
 - 7: Not supported
 - 8: Failed, will retry
 - 9: Failed permanently

## 5: Method

- 1: Set, Request a change, using the data provided.
- 2: Get, Request the current value or values.
- 3: Subscribe, Request to be notified with updates for the message.
- 4: Do, Perform an action, using the data provided.
- 5: Unsubscribe, Request to no longer be notified with updates for the message.

## 6: Subscription interval

Interval in ms. To be used with the SUBSCRIBE method

<!-- ## 9: Forwarded For Type (RESERVED FOR FUTURE USE)

 - 1: Device
 - 2: Module
 - 3: Link -->

## 10: Forwarded For

ID of the client sending the original message that is being forwarded.

## 11: Forwarded RSSI

RSSI of forwarded message, where applicable.

## 12: Forwarded SNR

SNR of forwarded message, where applicable.

<!-- ## 13: Forward To Type (RESERVED FOR FUTURE USE)-->

## 14: Forward To

ID of the client to forward the message to. Forwarding to type alters the meaning of this field
