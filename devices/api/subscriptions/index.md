# Subscriptions

Subscriptions are a record of a request to receive specific message types at a requested interval.

These make use of the [Method header (5)](/devices/api/protocol/headers#5-method), and possible values of `SUBSCRIBE` and `UNSUBSCRIBE`, followed by additional headers to define other subscription related information.

<!-- TODO it would be nice to include short descriptions of the headers here direct from the spec... -->

 - [Interval (6)](/devices/api/protocol/headers#6-interval)
 - [Duration (7)](/devices/api/protocol/headers#7-duration)
 - [Timeout (8)](/devices/api/protocol/headers#8-timeout)
 - [Storage Level (15)](/devices/api/protocol/headers#15-storage-level)
 - [Message Level (16)](/devices/api/protocol/headers#16-message-level)
 - [Subscription ID (17)](/devices/api/protocol/headers#17-subscription-id), see [IDs](#ids) section below.

## Default Subscriptions

### Chasm Link

:::alpha Default Subscriptions
This default subscriptions are still being developed, and if you explicitly want data at a set interval, you should send your own subscriptions.
:::

By default, when a device connects to the Chasm link, subscriptions for [Position messages](/devices/api/messages/15-position) and [Status messages](/devices/api/messages/34-device-status) are created automatically.

- Position: Valid only, RAM, 1000ms
- Status: Changes only, RAM, 500ms

These can be altered by sending new subscription requests with different parameters for ID `0`, or with no ID. Alternatively they can be explicitly UNSUBSCRIBED.

## Examples

<script setup>
import { data as protocolData } from '../../../yaml-data.data.ts'
import Message from '../../../components/Protocol/Message.vue'

// Get the Position message subscription example
const positionMessage = protocolData.messages[15]
const subscriptionExample = positionMessage.examples.find(example => example.name === 'Subscription request')
</script>

### Position Subscription Request

A real subscription request for position data: No message level specified, RAM storage, every 1000ms, with implied Subscription ID `0`.

<Message
    :byteString="subscriptionExample.bytes"
    :yaml-data="protocolData"
    :defaultCollapsed="false"
    :realDeviceInfo="subscriptionExample.real"
/>

## IDs

:::alpha
New feature, subject to alterations, for advanced usage
:::

Subscription IDs are an advanced feature, and can be used to uniquely identify multiple different subscriptions for the same message type.

Subscriptions that do not include a Subscription ID are considered to have a default ID of `0`. This includes any [default subscriptions](#default-subscriptions)

### Requests

When creating a subscription, you can optionally include the [Subscription ID (17)](/devices/api/protocol/headers#17-subscription-id) header.

Only one subscription per message type and Subscription ID combination can exist at a time. If a new subscription is created with the same message type and Subscription ID as an existing subscription, the existing subscription will be replaced.

### Responses

When a message is generated as part of a subscription, the Subscription ID header may be included to indicate which subscription this message is fulfilling.

In the case that the subscription was created without a Subscription ID (defaulting to `0`), the Subscription ID header will be omitted from the message.
