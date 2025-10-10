---
outline: [2,3]
---

<script setup>
import Message from '../../../components/Protocol/Message.vue';
</script>

# Structure

- Protocol Version: The version of the protocol (always 3).
- Message Length: The length of the message, including the version, header, data, and checksum.
- Message Type: The type of message. This is used to determine how to interpret the message.
- Data: Both data field (header and payload) are made up of the same format:
  - Field Count: The number of fields in the data.
  - Fields: List of field types in the data
  - Data: The data itself, making used of bBytes to represent length and values.
- Checksum: A 16-bit CRC checksum of the message (XMODEM).

### Data

Within each Data element (the header data, or payload data), the structure is as follows:

| Byte position | Description      | Type  | Example |
| ------------- | ---------------- | ----- | ------- |
| 1 -> 2             | Number of fields (n) | uint16 | 2 0       |
| 3 -> 3+n      | Field types | []uint8 | 1 2        |
| 3+n+1 -> end  | Data | []bBytes | [1 8] [3 9 9 9]  |

The Data should be in the order of the field types.

The example data includes `2` data fields, the first of type `1`, with value byte array `[8]`, the second of type `2`, with value byte array `[9 9 9]`.

#### bBytes

bBytes are a byte array that represents a length and then the data itself.

For example, `[1 8]` would represent a byte array of length 1, with the value 8.

Or `[3 9 9 9]` would represent a byte array of length 3, with the values 9, 9, 9.
