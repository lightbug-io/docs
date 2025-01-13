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
| 1     | Unix     | Unix Time         | uint32 | 2878397041 |
| 2     | Year     | Year              | TBD | TBD |
| 3     | Month    | Months since January - [0, 11]             | uint8 | 1 |
| 4     | Day      | Day of the month - [1, 31]               | uint8 | 10 |
| 5     | Weekday  | Days since Sunday - [0, 6]  | | 248 |
| 6     | Hour     | Hours since midnight - [0, 23]              | uint8 | 12 |
| 7     | Minute   | Minutes after the hour - [0, 59]            | uint8 | 15 |
| 8     | Second   | Seconds after the minute - [0, 60]            | uint8 | 45 |

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
