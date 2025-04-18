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
</script>

::: danger ⚠️ Not yet public
The Device API currently in development and is not yet accessible on production devices.

These pages can be seen as a view of what is to come later this year.
:::

# 11: Open

Used to explicitly initiate communication.

Responses can be used to determine your target is alive and ready.

Targets **MAY** require an open message to be sent before they will respond to other messages.

Communications to Lightbug devices **MUST** start with an open message.

## Code

For convenience, the following constants can be referring to this message type.

<GenerateConsts :messageId="11"/>
