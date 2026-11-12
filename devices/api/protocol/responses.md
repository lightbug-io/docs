---
outline: [2,3]
---

# Responses and acknowledgments

A request and its reply are separate frames, with separate headers and data fields.
The operation's message page defines the reply type, payload and errors.
This page explains the shared conventions; it does not mean every request receives the same kind of reply.

## Message IDs

[Message ID (header 1)](./headers#1-message-id) is a shared optional header for requests, responses, publications and message tracing.
Individual implementations, transports or client services can impose additional requirements.
Send helpers may add an ID automatically; that is not a requirement to serialize one in every frame.

- On a request, use a nonzero ID when acknowledgment or reply correlation is needed.
- On a response, an optional Message ID identifies the response itself. It is independent of [Response to (header 3)](./headers#3-response-to), which identifies the original request.

## Correlating a reply

Include a nonzero [Message ID (header 1)](./headers#1-message-id) when you need to match replies to requests.
A correlated reply carries that ID in [Response to (header 3)](./headers#3-response-to).

## Typed responses and ACKs

Replies can take these forms:

- A typed response containing the requested data or result. Its message type is defined by the operation and need not always match the request type.
- An [ACK (MT5)](../messages/5-ack), which reports the command result without implying that a message-specific data payload was returned.

An operation can send an interim ACK and a later typed result. Some targets also send a transport ACK alongside a typed response. An immediate typed response can replace a separate success ACK.

An ACK can identify the original request through Response to and/or its **ACK Type data field (field 1)**.
ACK Type is the original message **type**, not the request's Message ID.
See the [MT5 packet format](../messages/5-ack#header) for its full schema.

### When an ACK is sent

Whether an ACK is sent depends on the operation and target, but generally speaking any message with an ID should be acked.
A missing or zero Message ID does not guarantee silence: typed replies and error replies may still be sent.
Follow the message page's documented behavior.

## Status and errors

[Status (header 4)](./headers#4-status) indicates a general reply status.

- Omitted Status means OK.
- `0` means OK.
- Positive values indicate a non-OK result; some are retryable rather than terminal. The operation page explains the relevant causes.
- `-1` means Processing, with further responses expected. A nonpositive value does not necessarily mean the operation has finished.

An unsuccessful command can use a different reply type from a successful one.

## Subscription replies and later updates

A subscription's control reply and its later publications are different events. A control ACK reports the command status; it is not the subscribed data. Later publications can have their own headers, payload and status behavior.

For Message Box, SUBSCRIBE/UNSUBSCRIBE use control ACKs. Later MT58 cache publications are distinct from terminal subscription status messages: expiry or abandonment can be reported without a cache payload or Message Version header. Tracking-session uploads are a separate device-to-server context. See [Message Box SUBSCRIBE](../messages/58-message-box#message-58-operation-subscribe) and the [subscription reference](../subscriptions/) for the applicable rules.
