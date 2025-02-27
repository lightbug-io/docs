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

# 32: GSM IMEI

<SplitColumnView>
<template #left>

Used to [GET](./overview-device-services#get)) the IMEI of the device.

### Payload

It has a single field, the IMEI, which is a 15 byte ASCII string.

| Field | Name       | Description                      | Type   | Example | Actual |
| ----- | ---------- | -------------------------------- | ------ | ------- | - |
| 1     | IMEI | 15 bytes ASCII data | []byte  | 51 53 48 49 50 51 52 53 49 50 51 52 53 54 48 | 350123451234560 |

If the request could not be fulfilled, the response status would be 2 (NOT OK), all header fields would also be returned, but the payload should not be expected.

</template>
<template #right>

### Example
If you wanted to GET the IMEI from a device, you would send a GET message with the IMEI field requested (length 0).

<ProtocolBytes
byteString="3 19 0 32 0 2 0 1 5 1 234 1 2 1 0 1 0 21 145"
:boldPositions="[3,12,15,16]"
:allowCollapse="false"
/>

The device would then respond with a message of type 32, with the IMEI field filled in if known.

<ProtocolBytes
byteString="3 42 0 32 0 3 0 1 3 4 1 22 1 234 1 1 1 0 1 20 56 57 52 53 55 51 56 55 51 48 48 48 48 50 54 52 51 57 54 54 159 188"
:boldPositions="[20]"
:allowCollapse="false"
/>

</template>
</SplitColumnView>

## Code

For convenience, the following constants can be used to reference the payload fields.

<GenerateConsts :messageId="32"/>
