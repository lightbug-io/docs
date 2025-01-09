---
aside: false
outline: false
---

<script setup>
import ProtocolBytes from '../../../components/ProtocolBytes.vue';
import SplitColumnView from '../../../components/SplitColumnView.vue';
import GenerateConsts from '../../../components/GenerateConsts.vue'
</script>

# 35: GSM ICCID

<SplitColumnView>
<template #left>

Used to get the ID of the device.

### Payload

It has a single field, the ID, which is a uint.

| Field | Name       | Description                      | Type   | Example | Actual |
| ----- | ---------- | -------------------------------- | ------ | ------- | - |
| 1     | ID | | uintn  | xxx  | xxx |

If the request could not be fulfilled, the response status would be 2 (NOT OK), all header fields would also be returned, but the payload should not be expected.

</template>
<template #right>

### Example
If you wanted to GET the ID from a device, you would send a GET message with the ID field requested (length 0).

<ProtocolBytes
byteString="3 19 0 35 0 2 0 1 5 1 234 1 2 1 0 1 0 182 28"
:boldPositions="[3,12,15,16]"
:allowCollapse="false"
/>

The device would then respond with a message of type 35, with the ID field filled in if known.

<ProtocolBytes
byteString="3 26 0 35 0 3 0 3 4 1 1 121 1 1 1 6 1 0 1 4 240 209 132 0 179 158"
:boldPositions="[3,20]"
:allowCollapse="false"
/>

</template>
</SplitColumnView>

## Code

For convenience, the following constants can be used to reference the payload fields.

<GenerateConsts :prefix="'MD_DEVICE_GSM_ID_'" :enumName="'MD_DEVICE_GSM_ID'" :dataPath="'messages/35/data'"/>
