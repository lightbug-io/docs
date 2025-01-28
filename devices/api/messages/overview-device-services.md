<script setup>
import GenerateConsts from '../../../components/GenerateConsts.vue'
import ProtocolBytes from '../../../components/ProtocolBytes.vue'
</script>

::: danger ⚠️ Not yet public
The Device API currently in development and is not yet accessible on production devices.

These pages can be seen as a view of what is to come later this year.
:::

# Device Services

Device service messages make use of a few common header fields, and you can expect to see these in most messages.

- [3: Response Message ID](./../headers#_3-response-message-id): The message ID of the message being responded to.
- [4: Response Status](./../headers#_4-response-status): 1 (OK), 2 (NOT OK)
- [5: Method](./../headers#_5-method): 1 (Set), 2 (Get), 3 (Subscribe)

## Methods

### SET

Used to change data.

Specify the fields that you want to change, and the new values.

### GET

Used to ask for data.

When no payload fields are specified, then all fields are requested.

When a subset of fields are specified, only they should be returned. This can be done with a length of 0 for the field data.

### SUBSCRIBE

Used to ask for regular updates of data.
