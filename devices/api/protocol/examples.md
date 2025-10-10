---
outline: [2,3]
---

<script setup>
import Message from '../../../components/Protocol/Message.vue';
</script>

# Examples

### Type 3, header empty, data empty

<Message
    byteString="3 11 0 1 0 0 0 0 0 75 190"
    :defaultCollapsed="true"
></ProtocolBytes2>

### .. as above, with LB prefix bytes:

<Message
    byteString="76 66 3 11 0 1 0 0 0 0 0 75 190"
    :defaultCollapsed="true"
:yaml-data="protocolData"
></ProtocolBytes2>

### Type 6, header (1:1), data empty

<Message
    byteString="3 14 0 6 0 1 0 1 1 1 0 0 217 95"
    :defaultCollapsed="true"
:yaml-data="protocolData"
></ProtocolBytes2>

### Type 6, header (1:9), data empty

<Message
    byteString="3 14 0 6 0 1 0 1 1 9 0 0 120 246"
    :defaultCollapsed="true"
></ProtocolBytes2>

### Type 10009, header empty, data (10:hello):

<Message
    byteString="3 18 0 25 39 0 0 1 0 10 5 104 101 108 108 111 118 77"
    :defaultCollapsed="true"
></ProtocolBytes2>
