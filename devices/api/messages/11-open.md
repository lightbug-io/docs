---
aside: false
outline: false
---

<script setup>
import ProtocolBytes from '../../../components/ProtocolBytes.vue';
import SplitColumnView from '../../../components/SplitColumnView.vue';
import GenerateConsts from '../../../components/GenerateConsts.vue'
import PayloadTable from '../../../components/PayloadTable.vue'
import HeaderTable from '../../../components/HeaderTable.vue'
import { data as protocolData } from '../../../yaml-data.data.ts'
</script>

::: danger ⚠️ Not yet public
The Device API currently in development and is not yet accessible on production devices.

These pages can be seen as a view of what is to come later this year.
:::

# 11: Open

{{yaml:public/files/protocol-v3.yaml:messages.11.description}}

## Fields

<PayloadTable :messageId="11" :yaml-data="protocolData" :show-header="false"/>

## Code

For convenience, the following constants can be referring to this message type.

<GenerateConsts :messageId="11"/>
