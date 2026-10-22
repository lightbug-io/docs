# Messages

Messages are the core building blocks of the protocol, allowing you to send and receive data and commands to and from devices.

All messages follow a common structure, but each type of message has its own specific purpose, payload, requirements and usage.

## Types

Messages all have a type, represented as a `uint16` value, which defines the structure and purpose of the message, including what headers and payload it may or should contain.

Some example message types for the device API include:
- [13: Heartbeat](./13-heartbeat) - A simple message to indicate the communication link is alive
- [34: Device Status](./34-device-status) - A message containing various status information about the device
- [10008: Base Page](./10008-base-page) - A message to draw a preset page on the device's display
- [10011: Draw Element](./10011-draw-element) - A message to draw a shape on the device's display
- ...

You can find complete documentation for the messages used as part of the device API in the sidebar of this page.

Values of `60,000` to `61,000` are currently reserved for custom use. Feel free to implement your own messages within this range.

## Header fields

Messages make use of a few common [header fields](/devices/api/protocol/headers) that are defined at the protocol level that you'll likely want to familiarize yourself with as they are used in device messaging.

Such as:
- [1: Message ID](../protocol/headers#1-message-id) for uniquely identifying messages
- [3: Response to](../protocol/headers#3-response-to) for linking responses to requests
- [4: Status](../protocol/headers#4-status) for indicating the status of a message
- [5: Method](../protocol/headers#5-method) for optionally specifying the action to be taken

You can find the full list of header fields in the [Headers documentation](/devices/api/protocol/headers) for the protocol.

### Methods

A method is an optional header field that can be included in messages, and is sometimes used throughout the device API.

Currently defined methods are:
- `1: SET` - Set a value or state on the device
- `2: GET` - Get a value or state from the device
- `3: SUBSCRIBE` - Subscribe to updates for a value or state on the device
- `5: UNSUBSCRIBE` - Unsubscribe from updates for a value or state on the device

You can find more information about these methods in the [MH 5: Method](../protocol/headers#5-method) section.

## Communication patterns

A request can receive a typed response or an [ACK (MT5)](./5-ack). The operation reference defines its expected reply, payload and errors; later subscription publications are separate events.

See [Responses and acknowledgments](../protocol/responses) for Message ID/Response to correlation, Status, ACK suppression and message-format versions.
