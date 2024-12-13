---
outline: deep
---

# Structure

In a byte stream, a message may look as follows:

```
<prefix>
<message
    <version> <length> <type> <header data> <payload data> <checksum>
>
```

Each data element may look as follows:

```
<field count> <fields> <data (as bBytes)>
```

## Prefix

To aid reading from a possibly noisy byte stream, the protocol defines that messages can be prefixed with a set of start bytes.

`0x4c, 0x42`, or `76, 66`, which is the ASCII representation of `LB`.

This is REQUIRED for on device communication (though is optional in the protocol itself).

In combination with the protocol version, this allows for a simple check that indicates you are probably looking at the start of a message.

`0x4c 0x42 0x03` or `76 66 3` for example

## Message

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

| Format | Message |
| ------ | --- |
| uint8s  | 3 11 0 1 0 0 0 0 0 75 190 |
| Hex | `03 0b 00 01 00 00 00 00 00 4b be` |
| Bytes    | `0x03 0x0b 0x00 0x01 0x00 0x00 0x00 0x00 0x00 0x4b 0xbe` |

### Components

- Protocol Version: The version of the protocol. Always 3.
- Message Length: The length of the message, including the version, header, data, and checksum.
- Message Type: The type of message. This is used to determine how to interpret the message. (See [Message Types](#message-types) below.)
- Data: Both data field (header and payload) are made up of the same format:
  - Field Count: The number of fields in the data.
  - Fields: List of field types in the data
  - Data: The data itself, making used of bBytes to represent length and values.

#### Data

Within each Data element (the header data, or payload data), the structure is as follows:

| Byte position | Description      | Type  | Example |
| ------------- | ---------------- | ----- | ------- |
| 1             | Number of fields (n) | uint8 | 2       |
| 2 -> 2+n      | Field types | []uint8 | 1 2        |
| 2+n+1 -> end  | Data | []bBytes | [1 8] [3 9 9 9]  |

This data includes `2` data fields, the first of type `1`, with value byte array `[8]`, the second of type `2`, with value byte array `[9 9 9]`.

#### bBytes

bBytes are a byte array that represents a length and then the data itself.

For example, `[1 8]` would represent a byte array of length 1, with the value 8.

Or `[3 9 9 9]` would represent a byte array of length 3, with the values 9, 9, 9.



## Examples

| Description                          | Example |
| ---------------------------------- | -- |
| Type 3, header empty, data empty | 3 11 0 1 0 0 0 0 0 75 190 |
| .. as above, with LB prefix bytes |  76 66 3 11 0 1 0 0 0 0 0 75 190 |
| Type 6, header (1:1), data empty | 3 14 0 6 0 1 0 1 1 1 0 0 217 95 |
| Type 6, header (1:9), data empty | 3 14 0 6 0 1 0 1 1 9 0 0 120 246 |
| Type 10009, header empty, data (10:hello) | 3 18 0 25 39 0 0 1 0 10 5 104 101 108 108 111 118 77 |
