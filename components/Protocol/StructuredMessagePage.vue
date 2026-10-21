<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import Message from './Message.vue'
import MessageCodeGen from './MessageCodeGen.vue'
import {
  getMessageDocumentation,
  getOperationVariant,
  resolveDocumentationFields,
  type DocumentationOperation,
} from '../../utils/MessageDocumentation'

const props = defineProps<{
  messageId: number
  yamlData: Record<string, any>
}>()

const message = computed(() => props.yamlData.messages?.[props.messageId])
const documentation = computed(() => getMessageDocumentation(message.value))
const selectedOperationId = ref('')
const selectedVariantId = ref('')
const copyStatus = ref('')
const operation = computed(() => documentation.value?.operations.find(item => item.id === selectedOperationId.value)
  || documentation.value?.operations[0])
const variant = computed(() => operation.value && getOperationVariant(operation.value, selectedVariantId.value))
const activeVariantId = computed(() => operation.value?.variants?.find(item => item.id === selectedVariantId.value)?.id
  || operation.value?.variants?.[0]?.id || '')
const operationAnchor = (item: DocumentationOperation) => `message-${props.messageId}-operation-${item.id}`
const activeAnchor = computed(() => operation.value
  ? `${operationAnchor(operation.value)}${activeVariantId.value ? `-variant-${activeVariantId.value}` : ''}`
  : `message-${props.messageId}`)
const panels = computed(() => (documentation.value?.operations || []).flatMap(item => {
  const variants = item.variants?.length ? item.variants : [undefined]
  return variants.map((selection, index) => {
    const view = getOperationVariant(item, selection?.id)
    const variantId = selection?.id || ''
    const anchor = `${operationAnchor(item)}${variantId ? `-variant-${variantId}` : ''}`
    const contexts = (['request', 'response', 'publication'] as const).flatMap(role => {
      const usage = view[role]
      if (!usage) return []
      return [{
        role,
        title: usage.title || `${role[0].toUpperCase()}${role.slice(1)}`,
        description: usage.description,
        messageId: usage.messageId,
        messageName: usage.messageId === undefined ? undefined : props.yamlData.messages?.[usage.messageId]?.name,
        groups: (['headers', 'fields'] as const).map(kind => ({
          kind,
          title: kind === 'headers' ? 'Header fields' : 'Data fields',
          fields: resolveDocumentationFields(props.yamlData, usage.messageId === undefined ? message.value : props.yamlData.messages?.[usage.messageId], usage[kind], kind),
        })).filter(group => group.fields.length),
      }]
    })
    return {
      operation: item,
      variant: view,
      variantId,
      firstVariant: index === 0,
      anchor,
      active: operation.value?.id === item.id && activeVariantId.value === variantId,
      target: view.target || documentation.value?.target,
      contexts,
      errors: (view.errors || []).map(error => ({ ...error, name: props.yamlData.header?.[4]?.values?.[error.code]?.name })),
    }
  })
}))

// Presentation-only view: keep the existing constants generator and its language
// options, without repeating the full protocol narrative in every code comment.
const constantsData = computed(() => ({
  ...props.yamlData,
  messages: {
    ...props.yamlData.messages,
    [props.messageId]: {
      ...message.value,
      description: '',
      data: Object.fromEntries(Object.entries(message.value?.data || {}).map(([id, field]) => [
        id, { ...(field as Record<string, unknown>), description: '' },
      ])),
    },
  },
}))

async function readHash() {
  let hash: string
  try { hash = decodeURIComponent(window.location.hash.slice(1)) } catch { return }
  // Longer IDs win, so an operation such as read-version cannot match read first.
  const match = [...(documentation.value?.operations || [])]
    .sort((a, b) => operationAnchor(b).length - operationAnchor(a).length)
    .find(item => hash === operationAnchor(item) || hash.startsWith(`${operationAnchor(item)}-`))
  if (!match) return
  selectedOperationId.value = match.id
  selectedVariantId.value = [...(match.variants || [])]
    .sort((a, b) => b.id.length - a.id.length)
    .find(item => {
      const anchor = `${operationAnchor(match)}-variant-${item.id}`
      return hash === anchor || hash.startsWith(`${anchor}-`)
    })?.id || match.variants?.[0]?.id || ''
  await nextTick()
  document.getElementById(hash)?.scrollIntoView?.({ block: 'start' })
}

async function selectOperation(item: DocumentationOperation) {
  selectedOperationId.value = item.id
  selectedVariantId.value = item.variants?.[0]?.id || ''
  copyStatus.value = ''
  await nextTick()
  window.location.hash = operationAnchor(item)
}

async function selectVariant(event: Event) {
  selectedVariantId.value = (event.target as HTMLSelectElement).value
  copyStatus.value = ''
  await nextTick()
  document.getElementById(`${activeAnchor.value}-variant-control`)?.focus({ preventScroll: true })
  window.location.hash = activeAnchor.value
}

async function copyBytes(bytes: string, label: string) {
  try {
    await navigator.clipboard.writeText(bytes)
    copyStatus.value = `${label}: bytes copied.`
  } catch {
    copyStatus.value = 'Clipboard access is unavailable. Select the displayed bytes to copy them.'
  }
}

watch(() => props.messageId, () => {
  selectedOperationId.value = ''
  selectedVariantId.value = ''
  copyStatus.value = ''
  if (typeof window !== 'undefined') readHash()
})
onMounted(() => {
  readHash()
  window.addEventListener('hashchange', readHash)
})
onBeforeUnmount(() => {
  window.removeEventListener('hashchange', readHash)
})
</script>

<template>
  <div v-if="documentation && operation && variant" class="structured-message">
    <p class="message-summary">{{ documentation.summary }}</p>
    <p v-if="documentation.target" class="support-context"><strong>Applies to</strong> {{ documentation.target }}</p>

    <nav class="operation-navigation" aria-label="Message operations">
      <a
        v-for="item in documentation.operations"
        :key="item.id"
        :href="`#${operationAnchor(item)}`"
        :aria-current="operation.id === item.id ? 'true' : undefined"
        @click.prevent="selectOperation(item)"
      >{{ item.title }}</a>
    </nav>

    <section v-for="panel in panels" v-show="panel.active" :id="panel.anchor" :key="panel.anchor" class="operation-section" :aria-labelledby="`${panel.anchor}-heading`">
      <span v-if="panel.variantId && panel.firstVariant" :id="operationAnchor(panel.operation)" class="operation-anchor" aria-hidden="true"></span>
      <div class="operation-toolbar">
        <div class="wire-context" aria-label="Selected protocol context">
          <span class="protocol-label">V3 protocol</span>
          <span v-if="panel.operation.method" class="method-badge">{{ panel.operation.method }}</span>
          <span>Message {{ messageId }}</span>
          <span v-if="panel.variant.messageVersion !== undefined">Message Version {{ panel.variant.messageVersion }}</span>
        </div>
        <div v-if="panel.operation.variants?.length" class="variant-control">
          <label :for="`${panel.anchor}-variant-control`">Format / target</label>
          <select :id="`${panel.anchor}-variant-control`" :value="panel.variantId" @change="selectVariant">
            <option v-for="item in panel.operation.variants" :key="item.id" :value="item.id">{{ item.title }}</option>
          </select>
        </div>
      </div>

      <div class="reference-columns">
        <div class="reference-description">
          <h2 :id="`${panel.anchor}-heading`" class="operation-heading">
            {{ panel.operation.title }}
            <a class="section-permalink" :href="`#${panel.anchor}`" :aria-label="`Link to ${panel.operation.title}`">#</a>
          </h2>
          <p v-if="panel.operation.description" class="prose">{{ panel.operation.description }}</p>
          <p v-if="panel.variantId && panel.variant.description && panel.variant.description !== panel.operation.description" class="prose">{{ panel.variant.description }}</p>
          <p v-if="panel.target" class="target-context"><strong>Target</strong> {{ panel.target }}</p>

          <section
            v-for="context in panel.contexts"
            :key="`${panel.anchor}-${context.role}`"
            class="context-section"
            :aria-labelledby="`${panel.anchor}-${context.role}`"
          >
            <h3 :id="`${panel.anchor}-${context.role}`">{{ context.title }}</h3>
            <p v-if="context.messageId !== undefined" class="section-caption">Message {{ context.messageId }}<template v-if="context.messageName"> · {{ context.messageName }}</template></p>
            <p v-if="context.description" class="prose">{{ context.description }}</p>
            <div v-for="group in context.groups" :key="group.kind" class="field-group">
              <h4>{{ group.title }}</h4>
              <dl class="field-list">
                <div
                  v-for="field in group.fields"
                  :id="`${panel.anchor}-${context.role}-${group.kind}-${field.id}`"
                  :key="field.id"
                  class="field-row"
                >
                  <dt>
                    <span>{{ field.name }}</span>
                    <span class="field-id">{{ group.kind === 'headers' ? 'Header' : 'Field' }} {{ field.id }}</span>
                  </dt>
                  <dd>
                    <div class="field-metadata">
                      <code v-if="field.type">{{ field.type }}</code>
                      <span v-if="field.presence" class="presence" :class="`presence-${field.presence}`">{{ field.presence }}</span>
                      <span v-if="field.maxBytes !== undefined" class="field-limit">Maximum {{ field.maxBytes }} bytes</span>
                    </div>
                    <p v-if="field.value !== undefined" class="fixed-value"><strong>Value</strong> <code>{{ field.value }}</code><span v-if="field.valueName"> · {{ field.valueName }}</span></p>
                    <p v-if="field.description" class="prose">{{ field.description }}</p>
                    <ul v-if="field.values.length" class="field-values">
                      <li v-for="value in field.values" :key="value.value">
                        <code>{{ value.value }}</code><strong v-if="value.name"> {{ value.name }}</strong><span v-if="value.description">: {{ value.description }}</span>
                      </li>
                    </ul>
                  </dd>
                </div>
              </dl>
            </div>
          </section>

          <section v-if="panel.errors.length" class="context-section error-section" :aria-labelledby="`${panel.anchor}-errors`">
            <h3 :id="`${panel.anchor}-errors`">Errors</h3>
            <p class="section-caption">Status values in response header 4.</p>
            <dl class="error-list">
              <div v-for="error in panel.errors" :key="error.code">
                <dt><code>{{ error.code }}</code> {{ error.name }}</dt>
                <dd class="prose">{{ error.description }}</dd>
              </div>
            </dl>
          </section>

        </div>

        <aside class="reference-examples" :aria-labelledby="`${panel.anchor}-examples`">
          <h2 :id="`${panel.anchor}-examples`" class="examples-heading">Wire examples</h2>
          <p class="examples-caption">{{ panel.operation.title }}<template v-if="panel.variantId"> · {{ panel.variant.title }}</template>. Complete V3 frames, not HTTP requests.</p>
          <div v-if="!panel.variant.examples?.length" class="empty-examples">No wire example is documented for this selection.</div>
          <article
            v-for="(example, exampleIndex) in panel.variant.examples || []"
            :id="`${panel.anchor}-example-${exampleIndex + 1}`"
            :key="`${panel.anchor}-${exampleIndex}`"
            class="example-card"
            :aria-labelledby="`${panel.anchor}-example-${exampleIndex + 1}-title`"
          >
            <header class="example-header">
              <span class="example-provenance">{{ example.provenance === 'generated' ? 'Synthetic example' : 'Captured example' }}</span>
              <h3 :id="`${panel.anchor}-example-${exampleIndex + 1}-title`">{{ example.title }}</h3>
              <p v-if="example.description" class="prose">{{ example.description }}</p>
              <p v-if="example.target" class="example-target"><strong>Target</strong> {{ example.target }}</p>
              <p v-if="example.provenance === 'generated'" class="provenance-note">Generated for illustration; not a device capture.</p>
            </header>
            <div v-for="(frame, frameIndex) in example.frames" :key="frameIndex" class="example-frame">
              <div class="frame-heading">
                <h4 :id="`${panel.anchor}-example-${exampleIndex + 1}-frame-${frameIndex + 1}`"><span class="frame-role">{{ frame.role }}</span>{{ frame.label }}</h4>
                <button type="button" class="copy-button" :aria-label="`Copy bytes: ${example.title}, ${frame.label}`" @click="copyBytes(frame.bytes, frame.label)">Copy</button>
              </div>
              <pre class="wire-bytes" :aria-labelledby="`${panel.anchor}-example-${exampleIndex + 1}-frame-${frameIndex + 1}`"><code>{{ frame.bytes }}</code></pre>
              <details class="decoded-details">
                <summary>Decoded fields and byte layout</summary>
                <ClientOnly>
                  <Message v-if="panel.active" :byte-string="frame.bytes" :yaml-data="yamlData" :default-collapsed="false" :show-generator-link="false" read-only />
                  <template #fallback><p class="section-caption">The interactive byte decoder is available after this page loads.</p></template>
                </ClientOnly>
              </details>
            </div>
          </article>

        </aside>
      </div>
    </section>
    <p class="copy-status" role="status" aria-live="polite">{{ copyStatus }}</p>
    <div class="reference-columns shared-reference">
      <div>
          <section v-if="documentation.notes?.length" class="context-section notes-section" :aria-labelledby="`message-${messageId}-notes`">
            <h3 :id="`message-${messageId}-notes`">Shared behavior</h3>
            <div v-for="note in documentation.notes" :key="note.id" class="shared-note">
              <h4 :id="`message-${messageId}-note-${note.id}`">{{ note.title }}</h4>
              <p class="prose">{{ note.description }}</p>
            </div>
          </section>
      </div>
      <div>
          <details :id="`message-${messageId}-constants`" class="constants-details">
            <summary>Message and field constants</summary>
            <p class="section-caption">Identifiers only. The operation rules and limits are documented on the left.</p>
            <MessageCodeGen :key="messageId" :message-id="messageId" :yaml-data="constantsData" />
          </details>
      </div>
    </div>
  </div>
</template>

<style scoped>
.structured-message {
  --reference-accent: #a94e20;
  --reference-text: var(--vp-c-text-1);
  --reference-muted: var(--vp-c-text-2);
  color: var(--reference-text);
  font-size: 14px;
  line-height: 1.75;
}
.structured-message :is(h2, h3, h4, p, dl, dd, ul) { margin: 0; }
.structured-message :is(h2, h3, h4) { color: var(--reference-text); letter-spacing: -.015em; }
.structured-message p { color: var(--reference-muted); }
.structured-message [id] { scroll-margin-top: calc(var(--vp-nav-height, 64px) + 24px); }
.structured-message .message-summary { max-width: 850px; margin: 16px 0 10px; font-size: 16px; line-height: 1.8; white-space: pre-line; }
.support-context { font-size: 12px; }
.support-context strong, .target-context strong, .example-target strong { margin-right: 8px; font-weight: 600; }
.operation-navigation { display: flex; flex-wrap: wrap; gap: 4px 24px; margin-top: 28px; border-bottom: 1px solid var(--vp-c-divider); }
.operation-navigation a { display: inline-block; padding: 10px 2px 12px; border-bottom: 2px solid transparent; color: var(--reference-muted); font-weight: 600; text-decoration: none; }
.operation-navigation a:hover { color: var(--reference-accent); }
.operation-navigation a[aria-current] { border-bottom-color: var(--reference-accent); color: var(--reference-accent); }
.operation-anchor { display: block; height: 0; }
.operation-toolbar { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; padding: 18px 0 24px; }
.wire-context { display: flex; align-items: center; gap: 8px 12px; flex-wrap: wrap; font-size: 12px; color: var(--reference-muted); }
.protocol-label { font-weight: 600; }
.method-badge { padding: 1px 7px; border: 1px solid var(--vp-c-divider); border-radius: 4px; font-family: var(--vp-font-family-mono); color: var(--reference-text); background: var(--vp-c-bg-soft); font-weight: 600; }
.variant-control { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; font-size: 12px; }
.variant-control label { color: var(--reference-muted); font-weight: 500; }
.variant-control select { max-width: 100%; padding: 7px 30px 7px 10px; border: 1px solid var(--vp-c-divider); border-radius: 5px; color: var(--reference-text); background: var(--vp-c-bg-soft); font: inherit; appearance: auto; }
.reference-columns { display: grid; grid-template-columns: minmax(0, 1.04fr) minmax(0, 1fr); gap: 36px; align-items: start; }
.reference-description, .reference-examples { min-width: 0; }
.structured-message .operation-heading { padding: 0; border: 0; margin: 0 0 12px; font-size: 22px; line-height: 1.4; }
.section-permalink { padding: 0 4px; color: var(--reference-muted); font-size: 16px; font-weight: 400; text-decoration: none; }
.section-permalink:hover { color: var(--reference-accent); }
.prose { white-space: pre-line; overflow-wrap: anywhere; }
.reference-description > .prose + .prose { margin-top: 12px; }
.structured-message .target-context { margin-top: 16px; border-left: 2px solid var(--vp-c-divider); padding-left: 12px; font-size: 12px; }
.context-section { margin-top: 28px; padding-top: 22px; border-top: 1px solid var(--vp-c-divider); }
.context-section h3 { font-size: 18px; margin-bottom: 10px; }
.field-group { margin-top: 18px; }
.field-group h4 { font-size: 12px; font-weight: 600; color: var(--reference-muted); }
.field-list { margin-top: 6px !important; }
.field-row { border-top: 1px solid var(--vp-c-divider); padding: 14px 0; }
.field-row dt { display: flex; justify-content: space-between; flex-wrap: wrap; align-items: baseline; gap: 6px 12px; font-weight: 600; }
.field-id { color: var(--reference-muted); font-family: var(--vp-font-family-mono); font-size: 11px; font-weight: 400; }
.field-row dd { margin-top: 6px; color: var(--reference-muted); }
.field-metadata { display: flex; align-items: center; flex-wrap: wrap; gap: 6px 10px; margin-bottom: 6px; font-size: 11px; }
.structured-message code { color: inherit; background: var(--vp-c-bg-soft); font-size: .9em; }
.presence { text-transform: capitalize; }
.presence-required, .field-limit { color: var(--reference-accent); font-weight: 600; }
.fixed-value { margin: 5px 0 !important; font-size: 12px; }
.fixed-value strong { margin-right: 6px; }
.field-values { padding-left: 18px; margin-top: 8px !important; font-size: 12px; }
.field-values li + li { margin-top: 5px; }
.section-caption { font-size: 12px; color: var(--reference-muted); }
.error-list > div { padding: 12px 0; }
.error-list > div + div { border-top: 1px solid var(--vp-c-divider); }
.error-list dt { font-weight: 600; margin-bottom: 4px; }
.error-list dt code { margin-right: 6px; }
.error-list dd { color: var(--reference-muted); }
.shared-note + .shared-note { margin-top: 18px; }
.shared-note h4 { margin-bottom: 6px; font-size: 14px; }
.structured-message .examples-heading { margin: 0 0 5px; padding: 0; border: 0; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: .09em; }
.examples-caption { font-size: 12px; margin-bottom: 18px !important; }
.example-card { overflow-wrap: anywhere; border: 1px solid var(--vp-c-divider); border-radius: 9px; background: var(--vp-c-bg-soft); margin-bottom: 20px; }
.example-header { padding: 16px; }
.example-provenance { display: block; margin-bottom: 7px; color: var(--reference-muted); font-size: 10px; text-transform: uppercase; letter-spacing: .08em; font-weight: 600; }
.example-header h3 { font-size: 16px; line-height: 1.5; margin-bottom: 8px; }
.example-header p { font-size: 12px; }
.example-target { margin-top: 8px !important; }
.provenance-note { margin-top: 8px !important; font-size: 11px !important; }
.example-frame { border-top: 1px solid var(--vp-c-divider); }
.frame-heading { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; padding: 12px 16px; }
.frame-heading h4 { display: flex; align-items: baseline; flex-wrap: wrap; gap: 4px 10px; font-size: 12px; }
.frame-role { color: var(--reference-muted); text-transform: uppercase; font-size: 10px; letter-spacing: .07em; font-weight: 500; }
.copy-button { border: 1px solid var(--vp-c-divider); border-radius: 4px; padding: 2px 8px; font-size: 11px; color: var(--reference-text); white-space: nowrap; }
.copy-button:hover { background: var(--vp-c-bg); }
.structured-message .wire-bytes { margin: 0; padding: 14px 16px; background: #202c3d; color: #e0e8f1; font-size: 12px; line-height: 1.9; white-space: pre-wrap; overflow-wrap: anywhere; word-break: break-word; }
.structured-message .wire-bytes code { padding: 0; border-radius: 0; background: none; color: inherit; font-size: inherit; }
.decoded-details summary { padding: 10px 16px; color: var(--reference-muted); font-size: 12px; cursor: pointer; }
.decoded-details > :not(summary) { margin: 0 12px 12px; }
.decoded-details :deep(.protocol-bytes-container) { margin: 0 12px 12px; border-color: var(--vp-c-divider); border-radius: 5px; }
.decoded-details :deep(.byte-header) { flex-direction: column-reverse; gap: 10px; padding: 12px; background: var(--vp-c-bg); }
.decoded-details :deep(.byte-visualization-wrapper) { width: 100%; }
.decoded-details :deep(.byte-controls) { align-self: flex-end; }
.copy-status { font-size: 12px; }
.copy-status:empty { display: none; }
.empty-examples { border: 1px dashed var(--vp-c-divider); padding: 16px; color: var(--reference-muted); font-size: 12px; }
.constants-details { border-top: 1px solid var(--vp-c-divider); border-bottom: 1px solid var(--vp-c-divider); margin-top: 24px; }
.constants-details > summary { cursor: pointer; padding: 16px 0; font-size: 13px; font-weight: 600; }
.constants-details :deep(.protocol-constants-container) { margin: 12px 0 18px; border-color: var(--vp-c-divider); }
.constants-details :deep(.constants-header) { flex-wrap: wrap; gap: 8px; padding: 8px; background: var(--vp-c-bg-soft); }
.constants-details :deep(.language-tabs) { flex-wrap: wrap; gap: 4px; }
.constants-details :deep(.language-tab) { font-size: 11px; padding: 4px 7px; }
.constants-details :deep(.language-tab.active) { background: var(--vp-c-bg); border-color: var(--reference-accent); color: var(--reference-accent); }
.constants-details :deep(pre) { white-space: pre-wrap; overflow-wrap: anywhere; }
.structured-message :is(a, button, select, summary):focus-visible { outline: 2px solid var(--reference-accent); outline-offset: 4px; }
:global(.dark) .structured-message { --reference-accent: #eda577; }
@media (min-width: 1600px) { .structured-message { max-width: 1320px; } }
@media (max-width: 1100px) { .reference-columns { grid-template-columns: minmax(0, 1fr); gap: 32px; } }
@media (max-width: 639px) {
  .operation-navigation { gap: 4px 16px; }
  .operation-anchor { display: block; height: 0; }
.operation-toolbar { align-items: flex-start; }
  .variant-control { width: 100%; }
  .variant-control select { flex: 1; min-width: 0; }
  .structured-message .message-summary { font-size: 15px; }
  .reference-columns { gap: 28px; }
  .frame-heading { padding: 12px; }
  .example-header { padding: 14px 12px; }
  .structured-message .wire-bytes { padding: 12px; }
}
</style>
