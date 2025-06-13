---
outline: deep
---

# Glossary

| Term               | Description                                                             |
| ------------------ | ----------------------------------------------------------------------- |
| Message            | A single message sent between hosts                                     |
| Prefix | Optional bytes before a message to make it easier to see in a byte stream. |
| Header             | The first part of the message that contains metadata about the message. |
| Payload             | The primary data that is being sent in the message.                     |
| Header field type  | A field type (uint8) that is used within header data                    |
| Payload field type | A field type (uint8) that is used within payload data                   |
| bBytes             | A byte array that represents a length and then the data itself, such as `3 9 9 9`, where `3` is the length |
