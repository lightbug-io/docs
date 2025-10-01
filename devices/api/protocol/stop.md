---
outline: [2,3]
---

# Stop

The 2 bytes after the prefix and protocol version indicate the length of the message which gives you a stop point.

In total the first 5 bytes would look something like this with a prefix:

`0x4c 0x42 0x03 0x0b 0x00` or `76 66 3 11 0`.

Or with no prefix:

`0x03 0x0b 0x00` or `3 11 0`.
