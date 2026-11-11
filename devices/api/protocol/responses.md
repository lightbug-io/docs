---
outline: [2,3]
---

# Responses and acknowledgments

A request and its reply are separate frames, with separate headers and data fields. The operation's message page defines the reply type, payload and errors. This page explains the shared conventions; it does not mean every request receives the same kind of reply.

Use the operation's required request headers. An omitted [Method (header 5)](./headers#5-method) is not a universal GET default; GPS Control and Message Box require an explicit method.

## Message IDs

[Message ID (header 1)](./headers#1-message-id) is a shared optional header for requests, responses and publications. Individual implementations, transports or client services can impose additional requirements. Send helpers may add an ID automatically; that is not a requirement to serialize one in every frame.

- On a request, use a nonzero ID when acknowledgment or reply correlation is needed. The operation's reply rules still determine what is sent.
- On a response, an optional Message ID identifies the response itself. It is independent of [Response to (header 3)](./headers#3-response-to), which identifies the original request. Correlate using Response to, not the response's own ID. A response can contain both, either, or neither as permitted by its send path.
- Publications can also have their own IDs. An ID does not by itself make a publication a reply to a request.

The interaction YAML need not repeat an empty `1: {}` in every header list. It inherits this shared optional-ID convention; a local header-1 entry describes an actual requirement or exception. Omitting that entry is not an assertion that the wire frame lacks an ID. Separate ID-less interactions are unnecessary when only the shared acknowledgment or correlation rules differ.

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

Do not turn success-ACK suppression into a universal no-ID rule. OPEN/CLOSE handling and transport-specific send paths can have different acknowledgment behavior.

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

<span id="interaction-revisions"></span>

## Authoring interactions

Usage definitions live inline at `messages[messageId].interactions`. Each stable key describes an exchange through `request`, direct successful `response` (including ACK where applicable), and/or later or unsolicited `publication` stages. Existing SDK consumers still use the retained method maps.

```yaml
messages:
  58:
    # Existing data fields and wire-version definitions remain here.
    interactions:
      replace-message-box:
        title: Replace the cached message
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

`replace-message-box` is the stable key; its title can change without renaming the interaction. The request's Method header value `1` means SET, using the shared header enum. There is no second authored method label or interaction-revision layer. Documentation links and layout are maintained by the site code, not the protocol YAML.

`messageVersion: 2` references the containing message's existing wire format. It does not insert header 22; each stage's headers describe what is sent. Unversioned controls omit `messageVersion`, even if other interactions on the same message use versioned payloads. Message Box's current `read-message-box` and legacy `read-message-box-v1` are separate interactions, as are `subscribe-message-box` and `subscribe-message-box-v1`. Keep their keys stable; do not silently change an existing key to refer to a different wire format.

Stages inherit the containing message type unless they specify `messageId`, so the response above uses MT5. Field names, types, units, enums and descriptions come from that message's `data` and the shared `header` definitions. The uint8 type already gives header 22 its one-byte width; variable-size payload bounds such as `maxBytes: 1024` remain meaningful. Keep explicit selector behavior: legacy Message Box GET/SUBSCRIBE accepts omitted, zero or malformed-width selectors as version 1, and legacy responses omit header 22.

Payload descriptions inherit in this order: the canonical `data[fieldId].description`, an optional `versions[messageVersion].fields[fieldId].description`, then an explicit interaction-stage description. For example, a wire version can describe its cached-payload meaning once:

```yaml
versions:
  2:
    label: "2026-10"
    fields:
      129:
        description: Complete cached payload. Empty payload data is omitted when returned or published.
```

Both the version's field reference and its interactions inherit this text. An interaction can still override it when SET clears the cache or an upload carries independent bytes. Version overrides change descriptions only: they do not change field types, presence, limits, or participation. They apply only to that message's fields, never to a different response type such as MT5. Unversioned interactions use the canonical description. Migrated interactions do not inherit descriptions from the legacy SDK method maps.

A publication-only interaction needs no method or request. This shortened example describes the existing tracking upload:

```yaml
messages:
  58:
    interactions:
      tracking-message-box-upload:
        title: Tracking-session uploads
        messageVersion: 2
        publication:
          headers:
            22: {presence: required, value: 2}
          fields:
            129:
              description: Independent Transmit Now upload data.
```

Request mappings list expected inputs, optional by default; mark required inputs explicitly. Message ID follows the shared rule above and does not need a repeated empty entry. Leave unrelated inputs out, and keep important ignored or rejected input behavior in concise descriptions. An unlisted input is not a statement that firmware ignores, rejects or accepts it. Response and publication mappings can still mark omitted fields where wire-format or correlation differences matter. Write field descriptions only where the meaning differs.

An error entry needs only its status `code` to inherit the name and general description from header 4. Add `description` only for an operation-specific cause, without repeating the status name. For example, `{code: 7}` inherits Not Supported; `{code: 4, description: "A decoded Message Version value above 2."}` explains a particular Invalid Parameter case. These entries describe applicable errors, not a list of every status a transport might report.

Documentation method lists are derived from request header 5, with validation requiring a known selector for each request. An absent selector is not inferred as GET. Existing method-keyed SDK request/response maps remain unchanged, with validation requiring their method names to match the interactions for migrated messages. Multiple interactions may use one method, and publication-only interactions add none. Removing or regenerating the SDK maps is a separate migration.

GET, SET and SUBSCRIBE are values of Method header 5, not separate wire structures. An explicit selector in a documented interaction does not establish that every message requires it: LED controls, for example, can default to SET when Method is omitted. A message- or operation-specific header limit belongs with that use, rather than changing the shared header definition for all messages.

An interaction describes an exchange, not arbitrary ordered sequences of requests. Applicability can be narrowed with `target` without making fields required. Its stages remain subject to the correlation, suppression and target rules above; defining a response does not guarantee it is sent.

## Subscription replies and later updates

A subscription's control reply and its later publications are different events. A control ACK reports the command status; it is not the subscribed data. Later publications can have their own headers, payload and status behavior.

For Message Box, SUBSCRIBE/UNSUBSCRIBE use control ACKs. Later MT58 cache publications are distinct from terminal subscription status messages: expiry or abandonment can be reported without a cache payload or Message Version header. Tracking-session uploads are a separate device-to-server context. See [Message Box SUBSCRIBE](../messages/58-message-box#message-58-operation-subscribe) and the [subscription reference](../subscriptions/) for the applicable rules.
