---
aside: false
outline: false
---

<script setup>
import ProtocolBytes from '../../../components/ProtocolBytes.vue';
import SplitColumnView from '../../../components/SplitColumnView.vue'
import GenerateConsts from '../../../components/GenerateConsts.vue'
import PayloadTable from '../../../components/PayloadTable.vue'
import { data as protocolData } from '../../../yaml-data.data.ts'
</script>

::: danger ⚠️ Not yet public
The Device API currently in development and is not yet accessible on production devices.

These pages can be seen as a view of what is to come later this year.
:::

# 50: Link Control

<SplitColumnView>
<template #left>

Used to send data over a link.

</template>
<template #right>

<PayloadTable :messageId="51" headerText="Payload" headerMarginTop="0px" :yaml-data="protocolData" />

</template>
</SplitColumnView>

## Examples

TODO

## Code

For convenience, the following constants can be used to reference the payload fields.

<GenerateConsts :messageId="51" :yaml-data="protocolData"/>
