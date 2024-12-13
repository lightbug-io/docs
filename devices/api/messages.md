---
outline: [1,3]
---

# Generic

Message types that can be used in a variety of situations

## 5: ACK

Used to acknowledge a previously sent message.

**Data fields**

| Field | Name               | Description                         | Type |
| ----- | ------------------ | ----------------------------------- | ---- |
| 1     | Acked message type | Type of message that is being acked |  uint16    |
| 2     | Acked message ID   | ID if the message that is being acked, if previously provided. | uintn |

## 6: KeepAlive

Used to keep a connection alive, and let the other side know that the connection is still active.

No data is required or expected.

# Device Services

Device service messages make use of a few common header fields:

- [20: Method](./headers#_20-method): 1 (Set), 2 (Get), 3 (Subscribe)
- [22: Response Message ID](./headers#_22-response-message-id): The message ID of the message being responded to.
- [23: Response Status](./headers#_23-response-status): 1 (OK), 2 (NOT OK)

There are then multiple message types, each which represents its own service.

## 30: Transmit Now

Send arbitrary data.


**Data fields**

| Field | Name       | Description                      | Type   | Example |
| ----- | ---------- | -------------------------------- | ------ | ------- |
| 1     | Search GPS | Search for GPS (0 = no, 1 = yes) | uint8  | 0       |
| 2     | Data       | Up to 200 bytes of data to send  | []byte | 0x03 0x00 0x01 0x02 |
| 3     | Retries    | Number of retires                | uint8  | 1 |
<!-- Priority -->

## 31: GSM CFUN

TODO document...

## 32: GSM IMEI

TODO document...

## 33: GSM ICCID

TODO document...

## 34: Device Info: Status

TODO document...

## 35: Device Info: ID

TODO document...

## 36: Device Info: Time

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

## 37: Device Info: Last Position

TODO document...
