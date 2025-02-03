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

# 15: Last Position

::: danger Not yet documented
:::

<SplitColumnView>
<template #left>

Used to interact with the devices last position.

### Payload

::: danger Payload values will change soon
:::


| Field | Name       | Description                      | Type   | Example | Actual |
| ----- | ---------- | -------------------------------- | ------ | ------- | - |

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

<GenerateConsts :messageId="15"/>
