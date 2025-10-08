---
outline: [1,3]
---

<script setup>
import ProtocolGenerate from '../../../components/ProtocolGenerate.vue'
import { data as protocolData } from '../../../yaml-data.data.ts'
</script>

::: danger ⚠️ Not yet public
The Device API currently in development and is not yet accessible on production devices.

These pages can be seen as a view of what is to come later this year.
:::

# Generate

You can generate your own messages online using the this tool.

<ProtocolGenerate :yaml-data="protocolData"/>
