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

# 35: ID

<SplitColumnView>
<template #left>

Used to [GET](./overview-device-services#get)) the ID of the device.

### Payload

It has a single field, the ID, which is a uint.

| Field | Name       | Description                      | Type   | Example | Actual |
| ----- | ---------- | -------------------------------- | ------ | ------- | - |
| 1     | ID | | uintn  | 240 209 132 0  | 8704496 |

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
byteString="76 66 3 26 0 35 0 3 0 3 4 1 1 234 1 1 1 6 1 0 1 4 240 209 132 0 2 242"
:boldPositions="[3,20]"
:allowCollapse="false"
/>

</template>
</SplitColumnView>

## Code

For convenience, the following constants can be used to reference the payload fields.

<GenerateConsts :prefix="'MD_DEVICE_ID_'" :enumName="'MD_DEVICE_ID'" :dataPath="'messages/35/data'"/>
