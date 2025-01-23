---
aside: false
outline: false
---

<script setup>
import ProtocolBytes from '../../../components/ProtocolBytes.vue';
import SplitColumnView from '../../../components/SplitColumnView.vue';
</script>

# 6: KeepAlive

<SplitColumnView>
<template #left>

Used to keep a connection alive, and let the other side know that the connection is still active.

### Payload

Not required.

</template>
<template #right>

### Example
KeepAlive with no headers or payload
<ProtocolBytes
    byteString="76 66 3 11 0 6 0 0 0 0 0 10 118"
    :boldPositions="[3]"
    :allowCollapse="false"
/>

</template>
</SplitColumnView>
