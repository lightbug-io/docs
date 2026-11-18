---
order: 35
---

# Tracking sessions

A tracking session is a buffered group of V3 messages produced for one tracking upload. It is separate from a transport connection: a connection can carry multiple sessions, and a session is identified by its protocol session ID.

Firmware begins a session with **Session Start** (message type 21). Its message ID is the session ID; firmware adds that same ID as the `Session ID` header (field 20) to the start and each message accepted into the session. The start can include the reset code, alert sensor value, last send reason, last error, and an encryption public key when initiating the key exchange.

Firmware closes the group with **Session End** (message type 22). Its `Message Count` (field 20) includes the start and preceding messages, but excludes the end message. Firmware queues the completed buffer for tracking storage after the end is added; this describes local buffering, not server receipt or acknowledgement.

On the server, gingin can collect bounded session messages and attach their raw bytes to Session End in the `Received With` header (field 103). This bundle is optional: it can be disabled, and downstream processing skips the bundle when it is absent. This is server-side ingestion behavior, not a guarantee that every transport or server provides the field.

The message definitions remain marked hidden from the public protocol message reference in the protocol source. Their names and fields above describe current firmware behavior; the server behavior is specific to gingin.
