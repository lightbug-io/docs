<script setup lang="ts">
import { computed } from 'vue'
import { useOpenapi } from 'vitepress-openapi/client'

const props = defineProps<{
  spec: Record<string, any>
  operationId: string
}>()

// Use the renderer's parser, not raw response schemas. Its response component
// needs the same resolved UI schema and examples as the standard operation page.
const openapi = useOpenapi({ spec: props.spec })
const responses = computed(() => openapi.getOperation(props.operationId)?.responses)
</script>

<template>
  <div class="api-reference">
    <OAOperation :key="operationId" :operation-id="operationId" :spec="spec" :hide-branding="true">
      <!-- Relocate, rather than replace, the renderer's response controls. -->
      <template #responses />
      <template #playground="playground">
        <section v-if="responses" class="api-reference-responses" aria-label="Responses">
          <OAResponses :key="operationId" :operation-id="operationId" :responses="responses" />
        </section>
        <details class="api-reference-playground" open>
          <summary>Try this endpoint</summary>
          <OAPlayground v-bind="playground" />
        </details>
      </template>
    </OAOperation>
  </div>
</template>
