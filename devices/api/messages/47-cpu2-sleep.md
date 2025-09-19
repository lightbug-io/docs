---
aside: false
outline: false
---

<script setup>
import ProtocolBytes from '../../../components/ProtocolBytes.vue';
import SplitColumnView from '../../../components/SplitColumnView.vue';
import GenerateConsts from '../../../components/GenerateConsts.vue';
import PayloadTable from '../../../components/PayloadTable.vue';
import { data as protocolData } from '../../../yaml-data.data.ts'
</script>

::: danger ⚠️ Not yet public
The Device API currently in development and is not yet accessible on production devices.

These pages can be seen as a view of what is to come later this year.
:::

# 47: CPU2 Sleep

::: danger Not yet documented
:::

<SplitColumnView>
<template #left>

<PayloadTable :messageId="47" headerText="Payload" headerMarginTop="0px" :yaml-data="protocolData" />

</template>
<template #right>
</template>
</SplitColumnView>

## Code

For convenience, the following constants can be referring to this message type.

<GenerateConsts :messageId="47" :yaml-data="protocolData"/>
