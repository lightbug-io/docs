---
aside: true
outline: [2,3]
---

<script setup>
import PayloadSection from '../../../components/Protocol/PayloadSection.vue';
import ExamplesSection from '../../../components/Protocol/ExamplesSection.vue';
import CodeSection from '../../../components/Protocol/CodeSection.vue';
import { data as protocolData } from '../../../yaml-data.data.ts'
import { computed } from 'vue'

const messageId = 10011
const messageData = computed(() => protocolData?.messages?.[messageId])
</script>

# 10011: Draw Element

<span v-if="messageData?.description" style="white-space: pre-line;">{{ messageData.description }}</span>

## Payload

<PayloadSection :messageId="messageId" :yamlData="protocolData" />

### Element types

#### Box

##### Box with text

![=500x](https://upload.r2.lb.chasm.cloud/2025/10/ApplicationFrameHost_syTdANlguS.png)

#### Line

![=500x](https://upload.r2.lb.chasm.cloud/2025/10/ApplicationFrameHost_Hvs2087N6Q.png)

#### Circle

![=500x](https://upload.r2.lb.chasm.cloud/2025/10/ApplicationFrameHost_cJEn70CQo1.png)

#### Bitmap

![=500x](https://upload.r2.lb.chasm.cloud/2025/10/ApplicationFrameHost_NEQ3ZYBpTN.png)

## Examples

<ExamplesSection :messageId="messageId" :yamlData="protocolData" />

## Code

<CodeSection :messageId="messageId" :yamlData="protocolData" />
