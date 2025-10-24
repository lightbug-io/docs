---
outline: [2,3]
---

<script setup>
import { data as protocolData } from '../../../yaml-data.data.ts'

const headerIds = [1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 14, 15, 16, 17, 100, 101]
</script>

# Headers

These header field types are reserved across all message types and usages of the protocol.

For use in code, you can find a code generation section at the [bottom of this page](#code-generation).

<HeaderPageSection :header-ids="headerIds" :yaml-data="protocolData" />

## Code generation

<MessageCodeGen :dataName="'MH'" :dataPath="'header'" :header-ids="headerIds" :yaml-data="protocolData"/>
