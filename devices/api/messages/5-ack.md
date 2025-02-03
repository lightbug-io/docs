---
aside: false
outline: false
---

<script setup>
import ProtocolBytes from '../../../components/ProtocolBytes.vue';
import SplitColumnView from '../../../components/SplitColumnView.vue';
import GenerateConsts from '../../../components/GenerateConsts.vue'
import PayloadTable from '../../../components/PayloadTable.vue'
</script>

::: danger ⚠️ Not yet public
The Device API currently in development and is not yet accessible on production devices.

These pages can be seen as a view of what is to come later this year.
:::

# 5: ACK

<SplitColumnView>
<template #left>

Used to acknowledge a previously sent message.

The [Response Message ID](./../headers#_3-response-message-id) field in the header can be used in place of an ACK if an immediate response is being sent.

If a sender does not receive an ACK or response, it may resend the message.

ACKs should not themselves be ACKed.

</template>
<template #right>

<PayloadTable :messageId="5" headerText="Payload" headerMarginTop="0px" />

</template>
</SplitColumnView>

## Examples

### ID and Type known

ACK message, acknowledging a message with type `32` and ID `234`

<ProtocolBytes
    byteString="3 18 0 5 0 0 0 2 0 1 2 2 32 0 1 234 14 66"
    :boldPositions="[3,12,15]"
    :allowCollapse="false"
/>


### Only type known

In the case that a message ID is not known, the field can be omitted.

<ProtocolBytes
    byteString="3 15 0 5 0 0 0 1 0 1 2 32 0 164 69"
    :boldPositions="[3,11]"
    :allowCollapse="false"
/>

## Code

For convenience, the following constants can be used to reference the payload fields.

<GenerateConsts :prefix="'MD_ACK_'" :enumName="'MD_ACK'" :dataPath="'messages/5/data'"/>
