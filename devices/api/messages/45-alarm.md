---
aside: false
outline: false
---

<script setup>
import ProtocolBytes from '../../../components/ProtocolBytes.vue';
import SplitColumnView from '../../../components/SplitColumnView.vue'
import GenerateConsts from '../../../components/GenerateConsts.vue'
import { data as protocolData } from '../../../yaml-data.data.ts'
</script>

::: danger ⚠️ Not yet public
The Device API currently in development and is not yet accessible on production devices.

These pages can be seen as a view of what is to come later this year.
:::

# 45: Alarm

::: danger Not yet documented
:::

<SplitColumnView>
<template #left>

### Payload

TODO.

</template>
<template #right>


</template>
</SplitColumnView>

## Code

For convenience, the following constants can be used to reference the payload fields.

<GenerateConsts :messageId="45" :yaml-data="protocolData"/>
