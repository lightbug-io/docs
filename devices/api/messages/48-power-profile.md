---
aside: false
outline: false
---

<script setup>
import ProtocolBytes from '../../../components/ProtocolBytes.vue';
import SplitColumnView from '../../../components/SplitColumnView.vue';
import GenerateConsts from '../../../components/GenerateConsts.vue';
import PayloadTable from '../../../components/PayloadTable.vue';
</script>

::: danger ⚠️ Not yet public
The Device API currently in development and is not yet accessible on production devices.

These pages can be seen as a view of what is to come later this year.
:::

# 48: Power Profile

::: danger Not yet documented
:::

<SplitColumnView>
<template #left>

<PayloadTable :messageId="48" headerText="Payload" headerMarginTop="0px" />

</template>
<template #right>
</template>
</SplitColumnView>

## Code

For convenience, the following constants can be referring to this message type.

<GenerateConsts :messageId="48"/>
