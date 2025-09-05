---
outline: [1,3]
---

<script setup>
import GenerateConsts from '../../../components/GenerateConsts.vue'
</script>

# Protocol

The protocol is designed to be:
 - Easy to use and understand
 - Efficient to read and build
 - Lightweight to store and transmit
 - Usable in a variety of settings, without complex or bloated dependencies


## Byte Breakdown

In a byte stream, you may receive a series of messages.

The makeup of a message is as follows (including options prefix) is as follows:

```
[optional prefix] <message>

<message> ::=       <version:uint8> <length:uint16> <type:uint16>
                    <header-data> <payload-data> <checksum:uint16>

<header-data> ::=   <data>
<payload-data> ::=  <data>

<data> ::=  <field-count:uint16> <fields:[]uint8> <data:[]bBytes>
```

::: info
All integers are in [little-endian](https://en.wikipedia.org/wiki/Endianness) format eg. (uint16 `1` is represented as `0x01 0x00`).
:::

As an example empty message including prefix (with no additional header or payload data):

<ProtocolBytes
    byteString="76 66 3 11 0 1 0 0 0 0 0 75 190"
    :allowCollapse="false"
></ProtocolBytes>

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

The general structure of a message is as follows:

| Byte position | Description                        | Type                      | Example |
| ------------- | ---------------------------------- | ------------------------- | -- |
| 1             | Protocol Version (always 3)        | uint8                     | 3 |
| 2 -> 3         | Message Length                     | uint16                    | 11 0 |
| 4 -> 5         | Message Type                       | uint16                    | 1 0 |
| 6 -> a         | Header Data (field count, fields, data) | uint16, []uint8, []bBytes | 0 0 |
| a -> b         | Payload Data (field count, fields, data)   | uint16, []uint8, []bBytes | 0 0 |
| b -> n | Checksum | uint16 | 75 190 |

So the full above example would be:

<ProtocolBytes
    byteString="3 11 0 1 0 0 0 0 0 75 190"
    :allowCollapse="false"
></ProtocolBytes>
