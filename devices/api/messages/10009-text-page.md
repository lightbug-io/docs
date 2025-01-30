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

# 10009: Text Page

Display or alter a text page on the device screen.

<SplitColumnView>
<template #left>

### Payload

| Field | Name       | Description                      | Type   | Example | Actual |
| ----- | ---------- | -------------------------------- | ------ | ------- | - |
| 3     | Page ID | | uintn  |   |  |
| 4     | Page Title | | ascii  |   |  |
| 5     | Status bar | Should the status bar be shown? | uint8  |   |  |
| 100-104 | Text lines | Lines of text to display on the screen | | |

</template>
<template #right>

### Example

Display a 3 line text page, with ID `200`, and a title "Page Title".

<ProtocolBytes
byteString="3 61 0 25 39 1 0 1 1 233 5 0 3 4 100 101 102 1 200 10 80 97 103 101 32 84 105 116 108 101 10 70 105 114 115 116 32 76 105 110 101 11 83 101 99 111 110 100 32 76 105 110 101 5 84 104 105 114 100 106 149"
:boldPositions="[3,20,31,42,54]"
:allowCollapse="false"
/>

Add a 4th line to the same page (ID 200), with the text `4th`.

<ProtocolBytes
byteString="3 22 0 25 39 1 0 1 1 200 2 0 3 103 1 200 3 52 116 104 245 201"
:boldPositions="[3,9,17]"
:allowCollapse="false"
/>

</template>
</SplitColumnView>

## Code

For convenience, the following constants can be used to reference the payload fields.

<GenerateConsts :prefix="'MD_DEVICE_TEXT_PAGE_'" :enumName="'MD_DEVICE_TEXT_PAGE'" :dataPath="'messages/10009/data'"/>
