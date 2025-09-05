---
outline: [2,3]
---

# Prefix

To aid reading from a possibly noisy byte stream, such as UART, and to increase efficiency, the messages can be prefixed with a set of start bytes.

`0x4c, 0x42`, or `76, 66`, which is the ASCII representation of `LB`.

In combination with the protocol version, this allows for a simple check that indicates you are probably looking at the start of a message.

`0x4c 0x42 0x03` or `76 66 3` for example.

Communication methods such as I2C or UDP will not include this prefix.
