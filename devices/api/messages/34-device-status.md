---
aside: false
outline: false
---

<script setup>
import ProtocolBytes from '../../../components/ProtocolBytes.vue';
import SplitColumnView from '../../../components/SplitColumnView.vue';
import GenerateConsts from '../../../components/GenerateConsts.vue'
</script>

# 34: Device Status

<SplitColumnView>
<template #left>

Used to [GET](./device-services#get) the general status of the device.

### Payload


| Field | Name       | Description                      | Type   | Example | Actual |
| ----- | ---------- | -------------------------------- | ------ | ------- | - |
| 1     | Battery | | uint8 | 47 | 47 |
| 2     | Signal | | uint8 | 60 | 60 |
| 3     | Device Mode | | uint8 | 0 | 0 |

If the request could not be fulfilled, the response status would be 2 (NOT OK), all header fields would also be returned, but the payload should not be expected.

</template>
<template #right>

### Example
If you wanted to GET all possible fields from the device.

<ProtocolBytes
byteString="3 17 0 34 0 2 0 5 1 1 2 1 51 0 0 206 243"
:boldPositions="[3,12]"
:allowCollapse="false"
/>

The device would then respond with a message of type 34, with the fields filled in.

<ProtocolBytes
byteString="76 66 3 29 0 34 0 3 0 3 4 1 1 51 1 1 1 12 3 0 1 2 3 1 47 1 100 1 0 196 29"
:boldPositions="[3,24,26,28]"
:allowCollapse="false"
/>

</template>
</SplitColumnView>

## Code

For convenience, the following constants can be used to reference the payload fields.

<GenerateConsts :prefix="'MD_DEVICE_GSM_ID_'" :enumName="'MD_DEVICE_GSM_ID'" :dataPath="'messages/34/data'"/>
