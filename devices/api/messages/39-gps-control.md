---
aside: false
outline: false
---

<script setup>
import ProtocolBytes from '../../../components/ProtocolBytes.vue';
import SplitColumnView from '../../../components/SplitColumnView.vue';
import GenerateConsts from '../../../components/GenerateConsts.vue'
import PayloadTable from '../../../components/PayloadTable.vue'
</script>

::: danger ⚠️ Not yet public
The Device API currently in development and is not yet accessible on production devices.

These pages can be seen as a view of what is to come later this year.
:::

# 39: GPS Control

<SplitColumnView>
<template #left>

Used to interact with the device GPS service.

Currently only accessible from Viper devices.

</template>
<template #right>

<PayloadTable :messageId="39" headerText="Payload" headerMarginTop="0px" />

</template>
</SplitColumnView>

### Example

::: danger Not yet documented
:::

<ProtocolBytes
byteString="0"
:boldPositions="[3,12,15,16]"
:allowCollapse="false"
/>

## Code

For convenience, the following constants can be used to reference the payload fields.

<GenerateConsts :messageId="39"/>
