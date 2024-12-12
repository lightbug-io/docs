---
outline: deep
---

# Structure

The general structure of a message is as follows:

| Byte position | Description                        | Type                      | Example |
| ------------- | ---------------------------------- | ------------------------- | -- |
| 1             | Protocol Version (always 3)        | uint8                     | 3 |
| 2 - 3         | Message Length                     | uint16                    | 11 0 |
| 4 - 5         | Message Type                       | uint16                    | 1 0 |
| 5 - a         | Header Data (field count, fields, data) | uint16, []uint8, []bBytes | 0 0 |
| a - b         | Data (field count, fields, data)   | uint16, []uint8, []bBytes | 0 0 |
| b - n | Checksum | uint16 | 75 190 |

So the full above example would be:

| Format | Message |
| ------ | --- |
| uint8s  | 3 11 0 1 0 0 0 0 0 75 190 |
| Hex | `03 0b 00 01 00 00 00 00 00 4b be` |
| Bytes    | `0x03 0x0b 0x00 0x01 0x00 0x00 0x00 0x00 0x00 0x4b 0xbe` |

## Components

- Prefix: Possibly Optional prefix bytes
- Protocol Version: The version of the protocol. Always 3.
- Message Length: The length of the message, including the version, header, data, and checksum.
- Message Type: The type of message. This is used to determine how to interpret the message. (See [Message Types](#message-types) below.)

### Prefix bytes

To aid reading from a possibly noisy byte stream, messages can be prefixed with a set of start bytes.

`0x4c, 0x42`, or `76, 66`, which is the ASCII representation of `LB`.

## Examples

| Description                          | Example |
| ---------------------------------- | -- |
| Type 3, header empty, data empty | 3 11 0 1 0 0 0 0 0 75 190 |
| .. as above, with LB prefix bytes |  76 66 3 11 0 1 0 0 0 0 0 75 190 |
| Type 6, header (1:1), data empty | 3 14 0 6 0 1 0 1 1 1 0 0 217 95 |
| Type 6, header (1:9), data empty | 3 14 0 6 0 1 0 1 1 9 0 0 120 246 |
| Type 10009, header empty, data (10:hello) | 3 18 0 25 39 0 0 1 0 10 5 104 101 108 108 111 118 77 |
