---
outline: [1,3]
---

<script setup>
import GenerateConsts from '../../../components/GenerateConsts.vue'
</script>

# Headers

These header field types are reserved across all message types and usages of the protocol.

For use in code, you can find a code generation section at the [bottom of this page](#code-generation).

## 1: Message ID

A `uint32` identifier for the message.

Useful for debugging, tracing, deduplication, acking, re-sends, responses and subscriptions.

## 2: Client ID

A `uint32` or `uint64` identifier for the client sending the message.

Can vary depending on the context of the messaging.

## 3: Response to

`uint32` message ID that this message is a response to.

Can be used both for direct responses, or subscription updates.

## 4: Message Status

`uint8`

The status of the message.

If omitted, the message is assumed to be OK, or determined by the context of the message.

0 indicates an OK status, below 0 is OK but with a special meaning.

Values above 0 indicate an error or other status that is not OK.
| Value | Name | Description |
|-------|------|-------------|
| 0     | OK | Everything appears to be OK |
| 1     | Generic Error | |
| 2     | Missing Payload Parameter | |
| 3     | Method Not Supported | e.g., SETting GPS position |
| 4     | Invalid Payload Parameter | Unsupported values requested (e.g., requesting the GPS data at 100hz) |
| 5     | Invalid State | e.g., requesting GPS data stream before turning GPS on |
| 6     | No Data | e.g., requesting GPS or time data when not yet available |
| 7     | Not Supported | If the receiver does not support the requested action or method |
| 8     | Failed Will Retry | Currently only used for tx now |
| 9     | Failed Permanently | |
| 10    | Abandoned | Status code when an action has timed out or been deliberately cancelled by another process |
| 11    | Expired | Status code when a request has expired and has been cancelled, typically subscriptions |

## 5: Method

`uint8`

The method of the message.

| Value | Name | Description |
|-------|------|-------------|
| 1 | SET | Set one or more values that are provided in the message payload. |
| 2 | GET | Get one or more values that have their types provided in the message payload. If no payload types are provided, all available values are returned. |
| 3 | SUBSCRIBE | Subscribe to a value or values. If no payload types are provided, all available values will be subscribed to. If a value changes, the service will send a message with the new value. |
| 5 | UNSUBSCRIBE | Unsubscribe from some previously subscribed-to data. |

## 6: Interval

`uint32`

Interval in ms. To be used with the SUBSCRIBE method

## 7: Duration

`uint32`

Time in ms. For subscriptions this defines a duration to keep the subscription active for. 0 = no time limit.

An ACK with EXPIRED status code will be sent if the subscription duration elapses without being renewed (with a new subscription request).

For actions that can be timed, this defines how long the action should go on for.

## 8: Timeout

`uint32`

Timeout in ms. When requesting data or services that can take time to acquire (such as a GPS fix), timeout defines how long to try for before abandoning the action.

An ACK with ABANDONED status code will be sent in this case.

For actions that support it, timeout defines how long to wait before performing the action.

## 9: Forwarded For Type

Reserved for future use.

## 10: Forwarded For

ID of the client sending the original message that is being forwarded.

## 11: Forwarded RSSI

RSSI of forwarded message, where applicable.

## 12: Forwarded SNR

SNR of forwarded message, where applicable.

## 13: Forward To Type

## 14: Forward To

ID of the client to forward the message to. Forwarding to type alters the meaning of this field

## 15: Storage Level

Reserved for future use.

## 16: Message Level

Reserved for future use.

## Code generation

<GenerateConsts :dataName="'MH'" :dataPath="'header'"/>
