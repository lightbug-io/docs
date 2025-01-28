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

# 10014: Screen Refresh

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

<GenerateConsts :prefix="'MD_DEVICE_UX_SCREEN_REFRESH_'" :enumName="'MD_DEVICE_UX_SCREEN_REFRESH'" :dataPath="'messages/10014/data'"/>
