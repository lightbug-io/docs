---
outline: deep
---

# Glossary

| Term               | Description                                                             |
| ------------------ | ----------------------------------------------------------------------- |
| [Toit](/devices/api/sdks/toit/) | A programming language designed for IoT devices, which we provide a [high level SDK](/devices/api/sdks/toit/) for.<br>[[Toit official website](https://toitlang.org/)] |
| ESP32              | A popular low-cost microcontroller with built-in WiFi and Bluetooth, used in some Lightbug devices.<br>[[ESP32 on Wikipedia](https://en.wikipedia.org/wiki/ESP32)] |
| Message            | A packet of communication sent between clients, using the [Lightbug protocol](/devices/api/protocol/).                                     |
| [Prefix](/devices/api/protocol/prefix) | Optional bytes before a message to make it easier to see in a byte stream.<br>`0x4c, 0x42` which is `LB` in ascii. |
| Header             | The first part of the message that contains metadata about a message.<br>Length, type, method, and other generic metadata or instruction. |
| Payload             | The primary data that is being sent in a message.                     |
| [Header field](/devices/api/protocol/headers) type  | A field type `uint8` that is used within header data.<br>These are generally reused across all message types.                    |
| Payload field type | A field type `uint8` that is used within payload data.<br>These are generally specific to a message type.<br>See [messages](/devices/api/messages/).                   |
| bBytes             | A byte array that represents a length and that amount of data in bytes.<br>A bByte entry might be  `3 9 9 9`, where `3` is the length, and `9 9 9` is the data. |
