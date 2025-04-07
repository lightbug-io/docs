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

# 53: Ublox protection level

<SplitColumnView>
<template #left>

Used to retrieve [ublox protection level](https://www.u-blox.com/en/technologies/protection-level) information, on devices that have

</template>
<template #right>

<PayloadTable :messageId="53" headerText="Payload" headerMarginTop="0px" />

</template>
</SplitColumnView>

## Examples

TODO

## Code

For convenience, the following constants can be used to reference the payload fields.

<GenerateConsts :messageId="53"/>
