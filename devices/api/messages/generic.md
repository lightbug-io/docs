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
