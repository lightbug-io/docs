---
aside: false
outline: false
---

<script setup>
import ProtocolBytes from '../../../components/ProtocolBytes.vue';
import SplitColumnView from '../../../components/SplitColumnView.vue';
import GenerateConsts from '../../../components/GenerateConsts.vue'
</script>

::: danger ⚠️ Not yet public
The Device API currently in development and is not yet accessible on production devices.

These pages can be seen as a view of what is to come later this year.
:::

# 33: GSM ICCID

<SplitColumnView>
<template #left>

Used to [GET](./overview-device-services#get)) the ICCID of the device.

### Payload

It has a single field, the ICCID, which can contain up to 22 bytes of ASCII data.

| Field | Name       | Description                      | Type   | Example | Actual |
| ----- | ---------- | -------------------------------- | ------ | ------- | - |
| 1     | ICCID | up to 22 bytes ASCII data | []byte  | 56 57 52 53 55 51 56 55 51 48 48 48 48 50 54 52 51 57 54 54  | 89457387300002643966 |

If the request could not be fulfilled, the response status would be 2 (NOT OK), all header fields would also be returned, but the payload should not be expected.

</template>
<template #right>

### Example
If you wanted to GET the ICCID from a device, you would send a GET message with the ICCID field requested (length 0).

<ProtocolBytes
byteString="3 19 0 33 0 2 0 1 5 1 234 1 2 1 0 1 0 116 234"
:boldPositions="[3,12,15,16]"
:allowCollapse="false"
/>

The device would then respond with a message of type 33, with the ICCID field filled in if known.

<ProtocolBytes
byteString="3 42 0 33 0 3 0 3 4 1 1 234 1 1 1 163 1 0 1 20 56 57 52 53 55 51 48 48 48 48 48 48 50 50 50 54 49 53 51 52 92 210"
:boldPositions="[20]"
:allowCollapse="false"
/>

</template>
</SplitColumnView>

## Code

For convenience, the following constants can be used to reference the payload fields.

<GenerateConsts :messageId="33"/>
