---
outline: [2,3]
---

# Responses and acknowledgments

A request and its reply are separate frames, with separate headers and data fields. The operation's message page defines the reply type, payload and errors. This page explains the shared conventions; it does not mean every request receives the same kind of reply.

Use the operation's required request headers. An omitted [Method (header 5)](./headers#5-method) is not a universal GET default; GPS Control and Message Box require an explicit method.

## Correlating a reply

Include a nonzero [Message ID (header 1)](./headers#1-message-id) when you need to match replies to requests. A correlated reply carries that ID in [Response to (header 3)](./headers#3-response-to), not as its own Message ID.

For GPS Control GET and Message Box GET, a successful typed reply includes Response to and Status `0` only when the request has a nonzero Message ID. With an omitted or zero ID, both reply headers are omitted; the typed payload can still be returned.

Response to can also identify a subscription in some message types. Do not assume every unsolicited update carries it: for example, Message Box publications use their subscription context rather than replying to the SUBSCRIBE request.

## Typed responses and ACKs

Replies can take these forms:

- A typed response containing the requested data or result. Its message type is defined by the operation and need not always match the request type.
- An [ACK (MT5)](../messages/5-ack), which reports the command result without implying that a message-specific data payload was returned.

An operation can send an interim ACK and a later typed result. Some targets also send a transport ACK alongside a typed response. An immediate typed response can replace a separate success ACK. [GPS Control GET](../messages/39-gps-control#message-39-operation-get) and [Message Box GET](../messages/58-message-box#message-58-operation-get) return their own typed payloads. Their SET operations use ACKs instead.

An ACK can identify the original request through Response to and/or its **ACK Type data field (field 1)**. ACK Type is the original message **type**, not the request's Message ID. See the [MT5 packet format](../messages/5-ack#header) for its full schema.

### When an ACK is sent

Whether an ACK is sent depends on the operation and target. A missing or zero Message ID does not guarantee silence: typed replies and error replies may still be sent. Follow the message page's documented behavior.

## Status and errors

[Status (header 4)](./headers#4-status) belongs to the reply's **header**, not its data fields:

- Omitted Status means OK.
- `0` means OK.
- Positive values indicate a non-OK result; some are retryable rather than terminal. The operation page explains the relevant causes.
- `-1` means Processing, with further responses expected. A nonpositive value does not necessarily mean the operation has finished.

An unsuccessful command can use a different reply type from a successful one. The operation reference identifies that distinction. Do not assume every status-bearing frame is MT5: asynchronous subscription status messages can use the subscribed message type.

A correlated reply is not necessarily a final result. If an operation promises a typed payload, a generic ACK is not that payload. Follow the operation's expected reply type and status.

## Message format versions

[Message Version (header 22)](./headers#22-message-version) identifies a **message's payload format**. It is separate from the outer protocol version, which remains V3.

A request may select a format, and a response or publication may identify the format it carries. The message page defines supported values, defaults, required presence and invalid-value behavior. Header 22 is not an unconditional echo of the request and is not required on every reply.

For example, current-format Message Box GET responses and publications carry header 22 with value `2`, but its MT5 control ACKs and terminal subscription status messages do not. Legacy Message Box responses omit it. [Message Box's format sections](../messages/58-message-box#message-58-format-current) describe those differences; the dates used as documentation format names do not replace numeric values on the wire.

## Interaction revisions

The protocol YAML's `interactions` catalog names documented exchanges that reuse an existing message's method or named context. Resolving an interaction supplies its `request`, direct successful `response` (including ACK where applicable), and/or later or unsolicited `publication` messages from that exchange. It does not guarantee that every stage is sent; the existing correlation, suppression and target rules still apply. This initial catalog describes exchanges, not arbitrary ordered sequences of requests.

Interaction revisions and wire message formats are independent. For example, the first revision of this interaction uses Message Box's existing format 2:

```yaml
replace-message-box:
  messageId: 58
  method: SET
  versions: {1: {messageVersion: 2}}
```

`messageVersion` selects an existing method/context variant. It does not itself insert header 22; the referenced exchange defines the actual headers. Unversioned methods or contexts omit `messageVersion`, even when their containing message has versioned payloads. A publication-only interaction references `context` instead of `method`, without inventing a request or wire method.

Keep field definitions, descriptions, examples and applicability at their existing source. Interactions inherit them; an optional `target` can supply a more specific applicability description without making fields required. References share source semantics, so changes to an exchange require reviewing its interactions; a revision is not a frozen copy of that exchange. Existing `header`, `messages`, `data`, `methods` and message-version definitions remain usable without the catalog.

## Subscription replies and later updates

A subscription's control reply and its later publications are different events. A control ACK reports the command status; it is not the subscribed data. Later publications can have their own headers, payload and status behavior.

For Message Box, SUBSCRIBE/UNSUBSCRIBE use control ACKs. Later MT58 cache publications are distinct from terminal subscription status messages: expiry or abandonment can be reported without a cache payload or Message Version header. Tracking-session uploads are a separate device-to-server context. See [Message Box SUBSCRIBE](../messages/58-message-box#message-58-operation-subscribe) and the [subscription reference](../subscriptions/) for the applicable rules.
