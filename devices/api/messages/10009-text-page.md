---
aside: false
outline: false
---

<script setup>
import EinkText from '../../../components/EinkText.vue';
import ProtocolBytes from '../../../components/ProtocolBytes.vue';
import SplitColumnView from '../../../components/SplitColumnView.vue'
import GenerateConsts from '../../../components/GenerateConsts.vue'
import { data as protocolData } from '../../../yaml-data.data.ts'
</script>

::: danger ⚠️ Not yet public
The Device API currently in development and is not yet accessible on production devices.

These pages can be seen as a view of what is to come later this year.
:::

# 10009: Text Page

::: danger ⚠️ Recently altered
Redraw options have recently changed, and this page needs updating.
:::

<SplitColumnView>
<template #left>

Display or alter a text page on the device screen, with up to 5 lines of text.

A text page can have a title, and an optional status bar.

</template>
<template #right>

### Payload

| Field | Name       | Description                      | Type   | Example | Actual |
| ----- | ---------- | -------------------------------- | ------ | ------- | - |
| 3     | Page ID | | uint  |   |  |
| 4     | Page Title | | ascii  |   |  |
| 5     | Status bar | Should the status bar be shown? | uint8  |   |  |
| 100-104 | Text lines | Lines of text to display on the screen | | |

</template>
</SplitColumnView>

## Examples

### Show and update

Display a 3 line text page, with ID `200`, and a title "Page Title".

<EinkText
title="Page Title"
line1="First Line"
line2="Second Line"
line3="Third"
/>

<ProtocolBytes
byteString="3 61 0 25 39 1 0 1 1 233 5 0 3 4 100 101 102 1 200 10 80 97 103 101 32 84 105 116 108 101 10 70 105 114 115 116 32 76 105 110 101 11 83 101 99 111 110 100 32 76 105 110 101 5 84 104 105 114 100 106 149"
:boldPositions="[3,20,31,42,54]"
:allowCollapse="true" defaultCollapsed="true"
/>

Add a 4th line to the same page ID `200`, with the text `4th`, by providing the same page ID, and only the new text field.

<EinkText
title="Page Title"
line1="First Line"
line2="Second Line"
line3="Third"
line4="4th"
/>

<ProtocolBytes
byteString="3 22 0 25 39 1 0 1 1 200 2 0 3 103 1 200 3 52 116 104 245 201"
:boldPositions="[3,9,17]"
:allowCollapse="true" defaultCollapsed="true"
/>

Only a partial redraw will be performed in order to add the new line, and the existing lines will remain on the screen.

## Code

For convenience, the following constants can be used to reference the payload fields.

<GenerateConsts :messageId="10009" :yaml-data="protocolData"/>
