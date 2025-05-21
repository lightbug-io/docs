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

# 10010: Menu Page

Display or alter a menu page on the device screen.

<SplitColumnView>
<template #left>

### Payload

| Field | Name       | Description                      | Type   | Example | Actual |
| ----- | ---------- | -------------------------------- | ------ | ------- | - |
| 2     | Item count | | uint8  |   |  |
| 3     | Page ID | | uint  |   |  |
| 4     | Page Title | ??? | ascii  |   |  |
| 5     | Initial selection |  | uint8  |   |  |
| 100-119 | Menu items | Menu items to display on the screen | | |

</template>
<template #right>

### Example

Display a menu page with 2 options.

<ProtocolBytes
byteString="3 32 0 26 39 1 0 1 1 186 4 0 3 100 101 2 1 102 4 111 112 116 49 4 111 112 116 50 1 2 31 14"
:boldPositions="[]"
:allowCollapse="false"
/>

Add a third option.

<ProtocolBytes
byteString="3 26 0 26 39 1 0 1 1 187 3 0 3 2 102 1 102 1 3 4 111 112 116 51 203 164"
:boldPositions="[]"
:allowCollapse="false"
/>

</template>
</SplitColumnView>

## Code

For convenience, the following constants can be used to reference the payload fields.

<GenerateConsts :messageId="10010"/>
