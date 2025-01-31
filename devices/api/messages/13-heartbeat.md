---
aside: false
outline: false
---

<script setup>
import ProtocolBytes from '../../../components/ProtocolBytes.vue';
import SplitColumnView from '../../../components/SplitColumnView.vue';
import GenerateConsts from '../../../components/GenerateConsts.vue'
</script>

::: danger ⚠️ Not yet public
The Device API currently in development and is not yet accessible on production devices.

These pages can be seen as a view of what is to come later this year.
:::

# 13: Heartbeat

<SplitColumnView>
<template #left>

Sent from a device over an open connection to let the receiver know that the connection is still active.

## Payload

| Field | Name               | Description                         | Type |
| ----- | ------------------ | ----------------------------------- | ---- |
| 4     | GSM Signal | First byte is CSQ [0-31], 99 for unknown. Recommended to x4 to get a percentage. Byte 2 and 3 are uint16 LE network info. | bytes |
| 5     | Firmware version   | Current Firmware version of the device | uint16 |
| 6     | Battery percent   |  | uint8 |

</template>
<template #right>

### Example

Heartbeat message for device ID `9439544` with `100` % battery, on firmware version `143`.

<ProtocolBytes
    byteString="3 39 0 13 0 2 0 1 2 4 61 0 0 0 8 56 9 144 0 0 0 0 0 3 0 6 5 4 1 100 2 143 0 3 99 0 0 238 87"
    :boldPositions="[3]"
    :allowCollapse="false"
/>

</template>
</SplitColumnView>

## Code

For convenience, the following constants can be used to reference the payload fields.

<GenerateConsts :prefix="'MD_LIVELINK_'" :enumName="'MD_LIVELINK'" :dataPath="'messages/13/data'"/>
