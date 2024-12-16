---
outline: deep
---

# WIP Device API

The Lightbug communication protocol, also called the V3 protocol, is a byte oriented protocol used in a variety of settings around device communication.

The protocol builds on top of existing Lightbug Protocols, and is designed to be:
 - Efficient to read, build
 - Lightweight to store and transmit
 - Easy to use and understand
 - Usable in a variety of settings, without complex dependencies

## Example

An example prefixed and minimal message might look as follows:

| Format | Message |
| ------ | --- |
| Bytes  | 76 66 3 11 0 1 0 0 0 0 0 75 190 |
| Hex (short) | `4c 42 03 0b 00 01 00 00 00 00 00 4b be` |
| Hex    | `0x4c 0x42 0x03 0x0b 0x00 0x01 0x00 0x00 0x00 0x00 0x00 0x4b 0xbe` |

::: tip ℹ️ Info
All integers are in [little-endian](https://en.wikipedia.org/wiki/Endianness) format eg. (uint16 `1` is represented as `0x01 0x00`).
:::
