---
outline: deep
---

<script setup>
import ProtocolBytes from '../../components/ProtocolBytes.vue';
</script>

# Device API

The device API is a messaging system for communicating with Lightbug devices. It allows you to send and receive [messages](/devices/api/messages/) to and from the device, enabling control and data exchange.

It makes use of the [Lightbug communication protocol](/devices/api/protocol/), which is a byte oriented protocol used for device communication.

This documentation focuses  on the higher level element of this API first, including the [Toit SDK](/devices/api/sdks/toit/), before working its was down to the [message level](/devices/api/messages/), and finally the [protocol level](/devices/api/protocol/) which underpins it all.

You can [get started with Toit quickly](/devices/api/sdks/toit/), using an SDK built on top of the messages as another layer of abstraction.

## Capabilities

The Device API allows you to:
 - send commands to the device
 - ask for data (GET)
 - subscribe to data streams (SUBSCRIBE)
 - receive responses, instructions and other data from the device

On the wire, a single message might look like `4c 42 03 0b 00 01 00 00 00 00 00 4b be`, however, the API abstracts this away so you can work with high level messaging concepts.

## Accessability

Typically, it can be accessed via UART, I2C, or a UDP network connection.

## Availability

Device API access depends on the device and may not be supported on all models.

The [RH2 RTK device](/devices/rtk/) will be the first general release product to support the API, with a future low cost development board planned.

For details, please [contact our support team](https://lightbug.io/contact/).

If you have a supported device, you can [get started with Toit quickly](/devices/api/sdks/toit/) using the Lightbug SDK, or communicate with the device from other languages using the messages documented here.
