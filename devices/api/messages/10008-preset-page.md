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

# 10008: Preset Page

Displays a preset page that is hardcoded in the device.

<SplitColumnView>
<template #left>

### Payload

Currently there is only a single home page programmed per device.

In the future a payload field will be included to decide what page is shows, defaulting to the home page. Additional fields may be used to configure the preset pages.

| Field | Name       | Description                      | Type   | Example | Actual |
| ----- | ---------- | -------------------------------- | ------ | ------- | - |

</template>
<template #right>

### Example

<ProtocolBytes
byteString="3 14 0 24 39 1 0 1 1 126 0 0 25 55"
:boldPositions="[3]"
:allowCollapse="false"
/>

</template>
</SplitColumnView>

## Code

<GenerateConsts :messageId="10008"/>
