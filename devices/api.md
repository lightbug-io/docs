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

::: info
All integers are in [little-endian](https://en.wikipedia.org/wiki/Endianness) format eg. (uint16 `1` is represented as `0x01 0x00`).
:::

## Structure

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

### Components

- Prefix: Possibly Optional prefix bytes
- Protocol Version: The version of the protocol. Always 3.
- Message Length: The length of the message, including the version, header, data, and checksum.
- Message Type: The type of message. This is used to determine how to interpret the message. (See [Message Types](#message-types) below.)

#### Prefix bytes

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

## Message Types

### Generic

#### 5: ACK

Used to acknowledge a previously sent message.

#### 6: KeepAlive

Used to keep a connection alive, and let the other side know that the connection is still active.

### Device Services

Device service messages make use of a few common header fields:

- [20: Method](#_20-method): 1 (Set), 2 (Get), 3 (Subscribe)
- [22: Response Message ID](#_22-response-message-id): The message ID of the message being responded to.
- [23: Response Status](#_23-response-status): 1 (OK), 2 (NOT OK)

There are then multiple message types, each which represents its own service.

#### 30: Transmit Now

Send arbitrary data.


**Data fields**

| Field | Name       | Description                      | Type   | Example |
| ----- | ---------- | -------------------------------- | ------ | ------- |
| 1     | Search GPS | Search for GPS (0 = no, 1 = yes) | uint8  | 0       |
| 2     | Data       | Up to 200 bytes of data to send  | []byte | 0x00 0x01 0x02 |
| 3    | Retries           | Number of retires                                 | uint8 | 1 |
<!-- Priority -->

#### 31: GSM CFUN

TODO document...

#### 32: GSM IMEI

TODO document...

#### 33: GSM ICCID

TODO document...

#### 34: Device Info: Status

TODO document...

#### 35: Device Info: ID

TODO document...

#### 36: Device Info: Time

Interact with device time.

**Data fields**

| Field | Name     | Description       | Type | Example |
| ----- | -------- | ----------------- | ---- | ---- |
| 1     | Unix     | Unix Time         | uint32 | 1734014057 |
| 2     | Year     | Year              | uint8 | 24 |
| 3     | Month    | Month             | uint8 | 12 |
| 4     | Day     | Day              | uint8 | 31 |
| 6     | Hour     | Hour              | uint8 | 24 |
| 7     | Minute   | Minute            | uint8 | 59 |
| 8     | Second   | Second            | uint8 | 59 |
<!-- | 5     | Weekday  | Day of the Week   | | | -->

<!-- TODO, should year be a full year instead of just 24...?! -->

#### 37: Device Info: Last Position

TODO document...

## Generic Header Data

### 1: Message ID

Used to identify the message.

Messages that are chunked will have the same message ID for all chunks.

Can be used with ACK messages to identify the message that is being ACKed.

### 2: Client ID

Used to identify the client that sent the message where appropriate.

### Chunking

TODO document...

#### 3: Chunk Count
#### 4: Chunk Index

### Forwarding

TODO document...

#### 10: Forward For
#### 11: RSSI
#### 12: SNR
#### 13: Forwarded Type

### Services

#### 20: Method

- 1: Set, Request a change, using the data provided.
- 2: Get, Request the current value.
- 3: Subscribe, Request to be notified of changes.

#### 22: Response Message ID

This message is responding to a previous message with the specified message ID.

#### 23: Response Status

The status of the response.

 - 1: OK
 - 2: NOT OK
