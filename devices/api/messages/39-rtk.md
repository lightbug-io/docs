---
aside: false
outline: false
---

<script setup>
import ProtocolBytes from '../../../components/ProtocolBytes.vue';
import SplitColumnView from '../../../components/SplitColumnView.vue';
import GenerateConsts from '../../../components/GenerateConsts.vue'
</script>

# 39: RTK

<SplitColumnView>
<template #left>

Used to interact with the device RTK service.

### Payload

| Field | Name       | Description                      | Type   | Example | Actual |
| ----- | ---------- | -------------------------------- | ------ | ------- | - |
| 1     | Enable | Enable or disable the service | uint8  |  1 |  1|
| 2     | Request | Request regular updates of data | uint8  |  1 | 1|

If the request could not be fulfilled, the response status would be 2 (NOT OK), all header fields would also be returned, but the payload should not be expected.

</template>
<template #right>

### Example

::: danger Not yet documented
:::

<ProtocolBytes
byteString="0"
:boldPositions="[3,12,15,16]"
:allowCollapse="false"
/>

</template>
</SplitColumnView>

## Code

For convenience, the following constants can be used to reference the payload fields.

<GenerateConsts :prefix="'MD_DEVICE_RTK_'" :enumName="'MD_DEVICE_RTK'" :dataPath="'messages/39/data'"/>
