<script setup lang="ts">
import { computed } from 'vue'
import { useOpenapi, OACodeSamples } from 'vitepress-openapi/client'

const props = defineProps<{
  spec: Record<string, any>
  operationId: string
}>()

// Use the renderer's parser, not raw response schemas. Its response component
// needs the same resolved UI schema and examples as the standard operation page.
const openapi = useOpenapi({ spec: props.spec })
const operation = computed(() => openapi.getOperation(props.operationId))
const responses = computed(() => operation.value?.responses)
const codeSamples = computed(() => operation.value?.codeSamples)
</script>

<template>
  <div class="api-reference">
    <OAOperation :key="operationId" :operation-id="operationId" :spec="spec" :hide-branding="true">
      <!-- Relocate, rather than replace, the renderer's response controls. -->
      <template #responses />
      <template #code-samples />
      <template #playground="playground">
        <section class="api-reference-request" aria-label="Request example">
          <h2>Request example</h2>
          <OACodeSamples :key="operationId" :operation-id="operationId" :code-samples="codeSamples" />
        </section>
        <section v-if="responses" class="api-reference-responses" aria-label="Responses">
          <OAResponses :key="operationId" :operation-id="operationId" :responses="responses" />
        </section>
        <details class="api-reference-playground">
          <summary>Try this endpoint</summary>
          <OAPlayground v-bind="playground" />
        </details>
      </template>
    </OAOperation>
  </div>
</template>
