---
aside: false
outline: false
---

<script setup>
import ProtocolBytes from '../../../components/ProtocolBytes.vue';
import SplitColumnView from '../../../components/SplitColumnView.vue';
import GenerateConsts from '../../../components/GenerateConsts.vue'
</script>

# 37: Last Position

::: danger Not yet documented
:::

<SplitColumnView>
<template #left>

Used to interact with the devices last position.

### Payload

::: danger Payload values will change soon
:::


It has a single field, the ID, which is a uint.

| Field | Name       | Description                      | Type   | Example | Actual |
| ----- | ---------- | -------------------------------- | ------ | ------- | - |
| 1     | Altitude |  | uintn  |   |  |
| 2     | Lat |  | uintn  |   | |
| 3     | Lon |  | uintn  |   | |
| 4     | Speed |  | uintn  |   | |

If the request could not be fulfilled, the response status would be 2 (NOT OK), all header fields would also be returned, but the payload should not be expected.

</template>
<template #right>

### Example

<ProtocolBytes
byteString="0"
:boldPositions="[3,12,15,16]"
:allowCollapse="false"
/>

</template>
</SplitColumnView>

## Code

For convenience, the following constants can be used to reference the payload fields.

<GenerateConsts :prefix="'MD_DEVICE_LASTPOS_'" :enumName="'MD_DEVICE_LASTPOS'" :dataPath="'messages/37/data'"/>
