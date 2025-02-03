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

# 43: Battery Status

<SplitColumnView>
<template #left>

Get the battery status of a device

### Payload


| Field | Name       | Description                      | Type   | Example | Actual |
| ----- | ---------- | -------------------------------- | ------ | ------- | - |
| 1     | Voltage | | float32  |   |  |
| 2     | Percent | | uint8  |   |  |

If the request could not be fulfilled, the response status would be 2 (NOT OK), all header fields would also be returned, but the payload should not be expected.

</template>
<template #right>

### Example

Request battery status (all fields)

<ProtocolBytes
byteString="3 17 0 43 0 2 0 5 1 1 2 1 99 0 0 221 181"
:boldPositions="[3]"
:allowCollapse="false"
/>

Receive an OK response with `100` % battery and `4.4` volts.

<ProtocolBytes
byteString="3 32 0 43 0 2 0 3 1 4 99 0 0 0 4 36 0 0 0 2 0 2 1 1 100 4 223 79 141 64 210 80"
:boldPositions="[3,24,26]"
:allowCollapse="false"
/>

</template>
</SplitColumnView>

## Code

For convenience, the following constants can be used to reference the payload fields.

<GenerateConsts :messageId="43"/>
