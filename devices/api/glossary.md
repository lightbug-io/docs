---
outline: deep
---

# Glossary

A quick lookup for terms used in the device API. Follow the links for wire formats, supported operations and message-specific behavior.

## Messages and fields

| Term | Description |
| --- | --- |
| [Message / frame](./protocol/) | One unit of communication encoded using the Lightbug protocol. “Frame” refers to its encoded form on the wire. |
| [Message type (MT)](./messages/#types) | The number identifying a message's purpose and payload format, such as MT35 for Device IDs. It is not an individual Message ID. |
| [Prefix](./protocol/prefix) | Optional bytes before a message to help identify it in a byte stream: `0x4c, 0x42` (`LB` in ASCII). |
| [Header](./protocol/headers) | Shared metadata fields such as Message ID, Method and Status. The outer version, length and message type are separate from header data in the [message structure](./protocol/structure). |
| [Payload](./protocol/structure#data) | The message-specific data fields. A field named “Payload” may itself contain application bytes; its meaning is defined on the relevant message page. |
| [Header field ID](./protocol/headers) | A `uint8` identifier selecting a shared header field, not the data type of its value. Also called a header field type. |
| [Payload field ID](./messages/) | A `uint8` identifier selecting a field within a message's payload. Its meaning and value type depend on the message type. Also called a payload field type. |
| bBytes             | A byte array that represents a length and that amount of data in bytes.<br>The length prefix is a `uint8` (1 byte) for data type IDs 0–127, or a little-endian `uint16` (2 bytes) for data type IDs 128–255.<br>A bByte entry for a sub-128 field might be `3 9 9 9`, where `3` is the length, and `9 9 9` is the data.<br> A bByte entry for a field with ID 128 or greater might be `3 0 9 9 9`, where `3` is the length, and `9 9 9` is the data.<br> See [structure](/devices/api/protocol/structure#bbytes). |
| [Little-endian](./protocol/#byte-breakdown) | Byte order with the least-significant byte first, used for protocol integers. |

## Identifiers and versions

| Term | Description |
| --- | --- |
| [Message ID](./protocol/headers#1-message-id) | Identifies an individual message for tracking or correlating a reply; distinct from Message Type and Device ID. |
| [Response to](./protocol/headers#3-response-to) | Identifies the request or subscription a message responds to. See [reply correlation](./protocol/responses#correlating-a-reply). |
| [Client ID](./protocol/headers#2-client-id) | Identifies the client sending a message. Its interpretation depends on the context; Lightbug cloud services associate it with a Device ID. |
| [Device ID](./messages/35-device-ids) | The Lightbug device identifier used by the cloud API, distinct from the modem's IMEI, the SIM's ICCID and the device serial number. |
| [Subscription ID](./subscriptions/#ids) | Identifies a subscription within a message type. Omitting it addresses the default subscription, ID `0`. |
| [Protocol version](./protocol/structure) | The version of the outer message encoding, currently V3. It is independent of Message Version and firmware version. |
| [Message Version](./protocol/responses#message-format-versions) | Selects or identifies a message-specific payload format where supported. Supported values and defaults are defined by each message. |
| [Firmware version](./messages/34-device-status) | Identifies the software running on a device. Its encoding depends on the target and is separate from protocol and message-format versions. |

## Requests and updates

| Term | Description |
| --- | --- |
| [Method](./protocol/headers#5-method) | The requested operation, such as GET, SET, SUBSCRIBE or UNSUBSCRIBE. Supported methods and omission rules depend on the message. |
| [ACK / typed response](./protocol/responses#typed-responses-and-acks) | An ACK (MT5) acknowledges another message; a typed response carries the operation's documented reply payload. Neither a reply nor an ACK necessarily means the operation is complete. |
| [Subscription / publication](./subscriptions/) | A subscription requests later updates of a message type. A publication is an update, distinct from the subscription's [control reply](./protocol/responses#subscription-replies-and-later-updates). |
| [Status](./protocol/responses#status-and-errors) | A shared header reporting the reply's outcome or progress. It is separate from any message-specific payload field named Status. |

## Related terminology

| Term | Description |
| --- | --- |
| [GNSS / GPS](/terminology/positioning/gnss) | GNSS is satellite-based positioning; GPS is one of its satellite constellations. |
| [RTK / correction data / RTCM](/terminology/positioning/rtk) | RTK improves GNSS positioning using correction data, commonly carried in RTCM formats. |
| [Toit](./sdks/toit/) | A programming language for IoT devices, supported by the Lightbug SDK. |
| [ESP32](https://en.wikipedia.org/wiki/ESP32) | A microcontroller with WiFi and Bluetooth, used in some Lightbug devices. |
