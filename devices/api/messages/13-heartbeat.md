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

# 13: Heartbeat

<SplitColumnView>
<template #left>

Sent from a device over an open connection to let the receiver know that the connection is still active.

Can also be used to check if a connection is still active, as the message would be ACKed.

Devices currently default to sending a heartbeat every 15 seconds.

</template>
<template #right>

<PayloadTable :messageId="13" headerText="Payload" headerMarginTop="0px" />

</template>
</SplitColumnView>

<!-- ## Examples

Heartbeat message for device ID `9439544` with `100` % battery, on firmware version `143`.

TODO update to an example without fields..
<ProtocolBytes
    byteString="3 39 0 13 0 2 0 1 2 4 61 0 0 0 8 56 9 144 0 0 0 0 0 3 0 6 5 4 1 100 2 143 0 3 99 0 0 238 87"
    :boldPositions="[3]"
    :allowCollapse="true" defaultCollapsed="true"
/> -->

## Code

For convenience, the following constants can be used to reference the payload fields.

<GenerateConsts :messageId="13"/>
