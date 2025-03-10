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

# 30: Transmit Now

<SplitColumnView>
<template #left>

Send arbitrary data over GSM to the Lightbug cloud as a sensorReading of type `uart_blob`.

### Payload

| Field | Name       | Description                      | Type   | Example |
| ----- | ---------- | -------------------------------- | ------ | ------- |
| 1     | Search GPS | 0 = no gps fix required<br>1 = wait for GPS lock (or timeout) before send | uint8  | 0       |
| 2     | Data       | Up to 200 bytes of data to send  | []byte | 0x03 0x00 0x01 0x02 |
| 3     | Retries    | Number of retries [0-10]<br>Exponential backoff (10 = 25h)                | uint8  | 1 |
<!-- Priority -->

The message will initially be ACKed indicating the device has received the message.

When the data is sent to the cloud, or the send fails, a response will be sent with the status 1 (OK), 2 (NOT OK).

</template>
<template #right>

### Example
If you wanted to send the arbitrary data `foo` as ascii bytes to the cloud, you would send a message with the data field filled in.

<ProtocolBytes
byteString="3 22 0 30 0 2 0 5 1 1 4 1 131 1 0 2 3 102 111 111 180 28"
:boldPositions="[3,15,17]"
:allowCollapse="false"
/>

The message device will respond with an ACK, as the action is not immediate.

Later upon data transmission, the device will respond with a message of type 30, showing the status of the transmission.

<ProtocolBytes
byteString="3 20 0 30 0 3 0 3 4 1 1 131 1 1 1 92 0 0 84 149"
:boldPositions="[11,13]"
:allowCollapse="false"
/>

</template>
</SplitColumnView>

## Code

For convenience, the following constants can be used to reference the payload fields.

<GenerateConsts :messageId="30"/>
