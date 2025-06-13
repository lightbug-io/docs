---
outline: deep
---

<script setup>
import ProtocolBytes from '../../components/ProtocolBytes.vue';
</script>

# Device API

The device API makes use of the Lightbug communication protocol, also known as the V3 protocol, which is a byte oriented protocol used for device communication.

The protocol builds on top of existing Lightbug protocols, and is designed to be:
 - Easy to use and understand
 - Efficient to read and build
 - Lightweight to store and transmit
 - Usable in a variety of settings, without complex or bloated dependencies

## API Access

API access depends on the device and may not be supported on all models.

Typically, it can be accessed via UART, I2C, or a UDP network connection.

For access details, please [contact our support team](https://lightbug.io/contact/).

Or you can [get started with Toit quickly](/devices/api/sdks/toit/) using the Lightbug provided SDK.

## Example Message

An example [prefixed](structure#prefix) and minimal message might look as follows:

| Format | Message |
| ------ | --- |
| Bytes  | 76 66 3 11 0 1 0 0 0 0 0 75 190 |
| Hex | `4c 42 03 0b 00 01 00 00 00 00 00 4b be` |

<ProtocolBytes
    byteString="76 66 3 11 0 1 0 0 0 0 0 75 190"
    :allowCollapse="false"
></ProtocolBytes>

::: info
All integers are in [little-endian](https://en.wikipedia.org/wiki/Endianness) format eg. (uint16 `1` is represented as `0x01 0x00`).
:::
