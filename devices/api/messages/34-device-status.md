---
aside: false
outline: false
---

<script setup>
import ProtocolBytes from '../../../components/ProtocolBytes.vue';
import SplitColumnView from '../../../components/SplitColumnView.vue';
import GenerateConsts from '../../../components/GenerateConsts.vue'
import PayloadTable from '../../../components/PayloadTable.vue'
import { data as protocolData } from '../../../yaml-data.data.ts'
</script>

::: danger ⚠️ Not yet public
The Device API currently in development and is not yet accessible on production devices.

These pages can be seen as a view of what is to come later this year.
:::

# 34: Device Status

<SplitColumnView>
<template #left>

Used to GET the general status of the device.

### Payload

<PayloadTable :messageId="34" headerText="" headerMarginTop="0px" :yaml-data="protocolData" />

</template>
<template #right>

### Example
If you wanted to GET all possible fields from the device.

<ProtocolBytes
byteString="3 17 0 34 0 2 0 5 1 1 2 1 51 0 0 206 243"
:boldPositions="[3,12]"
:allowCollapse="false"
 :yaml-data="protocolData"
/>

<!-- The device would then respond with a message of type 34, with the fields filled in.

<ProtocolBytes
byteString="76 66 3 29 0 34 0 3 0 3 4 1 1 51 1 1 1 12 3 0 1 2 3 1 47 1 100 1 0 196 29"
:boldPositions="[3,24,26,28]"
:allowCollapse="false"
 :yaml-data="protocolData"
/>

TODO update with more fields..
-->

</template>
</SplitColumnView>

## Code

For convenience, the following constants can be used to reference the payload fields.

<GenerateConsts :messageId="34" :yaml-data="protocolData"/>
