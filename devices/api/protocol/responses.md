---
outline: [2,3]
---

# Responses and acknowledgments

A request and its reply are separate frames, with separate headers and data fields. The operation's message page defines the reply type, payload and errors. This page explains the shared conventions; it does not mean every request receives the same kind of reply.

Use the operation's required request headers. An omitted [Method (header 5)](./headers#5-method) is not a universal GET default; GPS Control and Message Box require an explicit method.

## Correlating a reply

Include a nonzero [Message ID (header 1)](./headers#1-message-id) when you need to match replies to requests. A correlated reply carries that ID in [Response to (header 3)](./headers#3-response-to), not as its own Message ID.

For GPS Control GET and Message Box GET, a successful typed reply includes Response to and Status `0` only when the request has a nonzero Message ID. With an omitted or zero ID, both reply headers are omitted; the typed payload can still be returned.

Device Status GET also returns its typed payload directly; Response to and Status may be omitted when the request has no nonzero Message ID.

Response to can also identify a subscription in some message types. Do not assume every unsolicited update carries it: for example, Message Box publications use their subscription context rather than replying to the SUBSCRIBE request.

## Typed responses and ACKs

Replies can take these forms:

- A typed response containing the requested data or result. Its message type is defined by the operation and need not always match the request type.
- An [ACK (MT5)](../messages/5-ack), which reports the command result without implying that a message-specific data payload was returned.

An operation can send an interim ACK and a later typed result. Some targets also send a transport ACK alongside a typed response. An immediate typed response can replace a separate success ACK. [GPS Control GET](../messages/39-gps-control#message-39-operation-get) and [Message Box GET](../messages/58-message-box#message-58-operation-get) return their own typed payloads. Their SET operations use ACKs instead.

An ACK can identify the original request through Response to and/or its **ACK Type data field (field 1)**. ACK Type is the original message **type**, not the request's Message ID. See the [MT5 packet format](../messages/5-ack#header) for its full schema.

### When an ACK is sent

Whether an ACK is sent depends on the operation and target. A missing or zero Message ID does not guarantee silence: typed replies and error replies may still be sent. Follow the message page's documented behavior.

The following operation-specific conditions belong to this shared response reference, linked from each operation's response section:

- [GSM Control SET](../messages/31-gsm-control#message-31-operation-control-flight-mode) (including network search), [SIM settings SET](../messages/33-sim-settings#message-33-operation-select-sim1) (both SIM choices), and [Device Status SUBSCRIBE/UNSUBSCRIBE](../messages/34-device-status#message-34-operation-subscribe) send a success MT5 ACK only when the request includes a nonzero Message ID. They send no success ACK for an omitted or zero ID.
- For a request with a nonzero Message ID, [GPS Control SET](../messages/39-gps-control#message-39-operation-set) and [Message Box SET](../messages/58-message-box#message-58-operation-set) return a success ACK rather than the message-specific payload.
- [Message Box SUBSCRIBE/UNSUBSCRIBE](../messages/58-message-box#message-58-operation-subscribe) suppress success ACKs for an omitted or zero Message ID; error ACKs are not suppressed for this reason.

These conditions do not establish a universal rule for every MT5 reply.

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

Usage documentation lives inline at `messages[messageId].interactions`. Each named interaction defines one or more messages through `request`, direct successful `response` (including ACK where applicable), and/or later or unsolicited `publication` stages. These definitions drive the documentation and interaction helper. Existing SDK consumers still use the retained method maps.

Interaction revisions and wire message formats are independent. For example, the first revision of this interaction uses Message Box's existing format 2:

```yaml
messages:
  58:
    # Existing data fields and wire-version definitions remain here.
    interactions:
      replace-message-box:
        method: SET
        title: Replace the cached message
        versions:
          1:
            messageVersion: 2
            request:
              headers:
                5: {presence: required, value: 1}
                22: {presence: required, value: 2}
              fields:
                129: {presence: required, maxBytes: 1024}
            response:
              messageId: 5
```

`replace-message-box` is the stable lookup key; `title` is the display text and can change without renaming the interaction. The key `1` under `versions` identifies interaction revision 1, not wire format 1. Keep that revision explicit even when it is the only revision. The `messageVersion: 2` reference selects the existing wire format, while header 22 describes its presence and value on the request. An optional `anchorId` preserves an existing documentation fragment independently of the key and title.

Stages inherit the containing message type unless they specify `messageId`, so the response above uses the existing MT5 definition. Field names, types, units, enums and descriptions come from that message's `data` and the shared `header` definitions. The uint8 type already gives header 22 its one-byte width; variable-size payload bounds such as `maxBytes: 1024` remain meaningful.

A publication-only interaction uses the same explicit revision shape without inventing a method or request. This shortened example shows the existing tracking upload, not a new wire format:

```yaml
messages:
  58:
    interactions:
      tracking-message-box-upload:
        title: Tracking-session uploads
        versions:
          1:
            messageVersion: 2
            publication:
              headers:
                22: {presence: required, value: 2}
              fields:
                129:
                  description: Independent Transmit Now upload data.
```

Request mappings list expected inputs, optional by default; mark required inputs explicitly. Leave unrelated inputs out, and keep important ignored or rejected input behavior in concise descriptions. An unlisted input is not a statement that firmware ignores, rejects or accepts it. Response and publication mappings can still mark omitted fields where wire-format or correlation differences matter. Write field descriptions only where the meaning differs.

Documentation method lists are derived from the distinct `method` values on interactions. Existing method-keyed SDK request/response maps remain unchanged, with validation requiring their method names to match the interactions for migrated messages. Multiple interactions may use one method, and publication-only interactions add no method. Removing or regenerating the SDK maps is a separate migration.

`messageVersion` references the containing message's existing wire-version definition. It does not itself insert header 22; the stage's headers describe what is sent. Unversioned controls omit it, even if other interactions on that message use versioned payloads. A new interaction revision may reuse the same wire version. Publication-only interactions need no dummy request or method. Applicability can be narrowed with `target` without making fields required.

An interaction describes an exchange, not arbitrary ordered sequences of requests. Its stages remain subject to the correlation, suppression and target rules above; defining a response does not guarantee it is sent.

## Subscription replies and later updates

A subscription's control reply and its later publications are different events. A control ACK reports the command status; it is not the subscribed data. Later publications can have their own headers, payload and status behavior.

For Message Box, SUBSCRIBE/UNSUBSCRIBE use control ACKs. Later MT58 cache publications are distinct from terminal subscription status messages: expiry or abandonment can be reported without a cache payload or Message Version header. Tracking-session uploads are a separate device-to-server context. See [Message Box SUBSCRIBE](../messages/58-message-box#message-58-operation-subscribe) and the [subscription reference](../subscriptions/) for the applicable rules.
