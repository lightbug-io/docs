---
outline: deep
---

<script setup>
import ProtocolBytes from '../../components/ProtocolBytes.vue';
</script>

# Device API

The device API is a messaging system for communicating with Lightbug devices. It allows you to:
 - send commands to the device
 - ask for data (GET)
 - subscribe to data streams (SUBSCRIBE)
 - receive responses, instructions and other data from the device

It makes use of the Lightbug communication protocol, also known as the V3 protocol, which is a byte oriented protocol used for device communication.

On the wire, a single message might look like `4c 42 03 0b 00 01 00 00 00 00 00 4b be`, however, the API abstracts this away so you can work with high level messaging concepts.

And you can [get started with Toit quickly](/devices/api/sdks/toit/), using an SDK built on top of the messages as another layer of abstraction.

Typically, it can be accessed via UART, I2C, or a UDP network connection.


## Availability

Device API access depends on the device and may not be supported on all models.

The [RH2 RTK device](/devices/rtk/) will be the first general release product to support the API, with a future low cost development board planned.

For details, please [contact our support team](https://lightbug.io/contact/).

If you have a supported device, you can [get started with Toit quickly](/devices/api/sdks/toit/) using the Lightbug SDK, or communicate with the device from other languages using the messages documented here.
