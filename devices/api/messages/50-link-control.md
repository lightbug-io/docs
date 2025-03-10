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

# 50: Link Control

<SplitColumnView>
<template #left>

Used to control a remote device link, such as connecting to a UDP server, and using the V3 messaging protocol to communicate with it.

Once initiated, messages can be forwarded to the link directly using the forwarding headers.

</template>
<template #right>

<PayloadTable :messageId="50" headerText="Payload" headerMarginTop="0px" />

</template>
</SplitColumnView>

## Examples

TODO

## Code

For convenience, the following constants can be used to reference the payload fields.

<GenerateConsts :messageId="50"/>
