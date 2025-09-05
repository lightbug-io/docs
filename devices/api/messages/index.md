<script setup>
import GenerateConsts from '../../../components/GenerateConsts.vue'
import ProtocolBytes from '../../../components/ProtocolBytes.vue'
</script>

# Messages

Messages often make use of a few common [header fields](/devices/api/protocol/headers), and you can expect to see these in most messages types:

## Requests

Requests may or may not require a [MH 5: Method](../protocol/headers#_5-method) header field, such as `GET`, `DO`, `SET` or `SUBSCRIBE`.

This is decided by the individual message type, and if required, should be included in the header.



## Responses

You should receive a response to every valid and expected message when the recipient is able to process the request.

When a message ID is provided in the request, any direct response should include the initiating message ID in the header [MH 3: Response Message ID](../protocol/headers#_3-response-message-id).

Responses can come in the form of a basic [MT 5: ACK](./5-ack) or as the same message type as the request.

Responses should contain a [MH 4: Response Status](../protocol/headers#_4-response-status) in the header, where 0 and below are various OK responses, and anything higher than 0 indicates a warning or error.

## Types

Per the specification, message types are represented by a single `uint16` value.

Values of `60,000` to `61,000` are currently reserved for custom use.

Feel free to implement your own messages within this range.
