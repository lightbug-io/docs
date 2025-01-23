---
aside: false
outline: false
---

<script setup>
import ProtocolBytes from '../../../components/ProtocolBytes.vue';
import SplitColumnView from '../../../components/SplitColumnView.vue';
import GenerateConsts from '../../../components/GenerateConsts.vue'
</script>

# 10009: Text Page

::: danger Not yet documented
:::

<SplitColumnView>
<template #left>

### Payload

| Field | Name       | Description                      | Type   | Example | Actual |
| ----- | ---------- | -------------------------------- | ------ | ------- | - |

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

<GenerateConsts :prefix="'MD_DEVICE_UX_TEXT_PAGE_'" :enumName="'MD_DEVICE_UX_TEXT_PAGE'" :dataPath="'messages/10009/data'"/>
