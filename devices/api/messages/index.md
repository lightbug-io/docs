<script setup>
import GenerateConsts from '../../../components/GenerateConsts.vue'
import ProtocolBytes from '../../../components/ProtocolBytes.vue'
</script>

::: danger ⚠️ Not yet public
The Device API currently in development and is not yet accessible on production devices.

These pages can be seen as a view of what is to come later this year.
:::

# Messages

Messages often make use of a few common header fields, and you can expect to see these in most messages types:

## Requests

Requests may or may not require a method.

This is decided by the individual message type, and if required is set in the header field [5: Method](./../headers#_5-method).

## Responses

You should receive a response to every valid and expected message.

When a message ID is provided in the request, any direct response should include the initiating message ID in the header [3: Response Message ID](./../headers#_3-response-message-id).

Responses can come in the form of a basic [5: ACK](./5-ack) or as the same message type as the request.

Responses should contain a [4: Response Status](./../headers#_4-response-status) in the header, where 0 is OK, and anything higher indicates a warning or error.

## Types

Per the specification, message types are represented by a single `uint16` value.

Values of `60,000` to `61,000` are currently reserved for custom use. Feel free to implement your own messages within this range.
