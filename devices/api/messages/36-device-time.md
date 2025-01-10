---
aside: false
outline: false
---

<script setup>
import ProtocolBytes from '../../../components/ProtocolBytes.vue';
import SplitColumnView from '../../../components/SplitColumnView.vue';
import GenerateConsts from '../../../components/GenerateConsts.vue'
</script>

# 35: Time

<SplitColumnView>
<template #left>

Used to [GET](./device-services#get) the time from the device.

Initially the best available time will be provided. Moving forward we will be able to provide different times (GPS, GM etc.)

### Payload

| Field | Name     | Description       | Type | Example |
| ----- | -------- | ----------------- | ---- | ---- |
| 1     | Unix     | Unix Time         | uint32 | 1734014057 |
| 2     | Year     | Year              | uint16 | 2024 |
| 3     | Month    | Month             | uint8 | 12 |
| 4     | Day      | Day               | uint8 | 31 |
| 5     | Weekday  | Day of the Week   | | |
| 6     | Hour     | Hour              | uint8 | 24 |
| 7     | Minute   | Minute            | uint8 | 59 |
| 8     | Second   | Second            | uint8 | 59 |

If the request could not be fulfilled, the response status would be 2 (NOT OK), all header fields would also be returned, but the payload should not be expected.

</template>
<template #right>

### Example
If you wanted to GET all elements of time from a device, you would send a GET message with no payload fields.

<ProtocolBytes
byteString="0"
:boldPositions="[3,12,15,16]"
:allowCollapse="false"
/>

The device would then respond with a message of type 36.

<ProtocolBytes
byteString="0"
:boldPositions="[3,20]"
:allowCollapse="false"
/>

</template>
</SplitColumnView>

## Code

For convenience, the following constants can be used to reference the payload fields.

<GenerateConsts :prefix="'MD_DEVICE_TIME_'" :enumName="'MD_DEVICE_TIME'" :dataPath="'messages/36/data'"/>
