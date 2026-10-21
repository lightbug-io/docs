<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { withBase } from 'vitepress'
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
const copyStatus = ref('')
const operationAnchor = (item: DocumentationOperation) => `message-${props.messageId}-operation-${item.id}`
const acknowledgmentUrl = withBase('/devices/api/messages/5-ack#header')
const panels = computed(() => (documentation.value?.operations || []).flatMap(item => {
  const variants = item.variants?.length ? item.variants : [undefined]
  const defaultVariant = variants.find(selection => !selection?.legacy) || variants[0]
  return variants.map(selection => {
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
        acknowledgment: usage.messageId === 5,
        referenceAnchors: usage.messageId === 5
          ? (['headers', 'fields'] as const).flatMap(kind => Object.keys(usage[kind] || {}).map(id => `${anchor}-${role}-${kind}-${id}`))
          : [],
        groups: usage.messageId === 5 ? [] : (['headers', 'fields'] as const).map(kind => ({
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
      defaultVariant: selection === defaultVariant,
      legacy: !!view.legacy,
      anchor,
      target: view.target || documentation.value?.target,
      contexts,
      errors: (view.errors || []).map(error => ({ ...error, name: props.yamlData.header?.[4]?.values?.[error.code]?.name })),
    }
  })
}))

// Modern operations stay in the main reading flow. Legacy definitions and
// operations share one disclosure, but remain in the static/searchable HTML.
const groups = computed(() => [
  {
    legacy: false,
    fields: resolveDocumentationFields(props.yamlData, message.value, documentation.value?.fields, 'fields'),
    panels: panels.value.filter(panel => !panel.legacy),
  },
  {
    legacy: true,
    fields: resolveDocumentationFields(props.yamlData, message.value, documentation.value?.legacyFields, 'fields'),
    panels: panels.value.filter(panel => panel.legacy),
  },
].filter(group => !group.legacy || group.fields.length || group.panels.length))

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
  await nextTick()
  const target = document.getElementById(hash)
  if (!target) return
  // Old v1 and field links still resolve. Open every enclosing disclosure before
  // scrolling, including on initial hydration and browser Back/Forward.
  let ancestor: HTMLElement | null = target
  while (ancestor) {
    if (ancestor.tagName === 'DETAILS') (ancestor as HTMLDetailsElement).open = true
    ancestor = ancestor.parentElement
  }
  await nextTick()
  target.scrollIntoView?.({ block: 'start' })
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
  <div v-if="documentation" class="structured-message">
    <p class="message-summary">{{ documentation.summary }}</p>
    <p v-if="documentation.target" class="support-context"><strong>Applies to</strong> {{ documentation.target }}</p>

    <div v-if="documentation.notes?.length" :id="`message-${messageId}-notes`" class="overview-notes">
      <section v-for="note in documentation.notes" :key="note.id" class="overview-note" :aria-labelledby="`message-${messageId}-note-${note.id}`">
        <h2 :id="`message-${messageId}-note-${note.id}`">{{ note.title }}</h2>
        <p class="prose">{{ note.description }}</p>
      </section>
    </div>

    <component
      :is="group.legacy ? 'details' : 'div'"
      v-for="group in groups"
      :id="group.legacy ? `message-${messageId}-legacy` : undefined"
      :key="group.legacy ? 'legacy' : 'current'"
      :class="group.legacy ? 'legacy-reference' : 'current-reference'"
    >
      <summary v-if="group.legacy">Legacy version 1: fields and operations</summary>
      <p v-if="group.legacy" class="legacy-introduction">For existing version 1 integrations. Current-format fields and operations are documented above.</p>

      <section v-if="group.fields.length" :id="`message-${messageId}-${group.legacy ? 'legacy-' : ''}fields`" class="message-fields" :aria-labelledby="`message-${messageId}-${group.legacy ? 'legacy-' : ''}fields-heading`">
        <h2 :id="`message-${messageId}-${group.legacy ? 'legacy-' : ''}fields-heading`">{{ group.legacy ? 'Legacy fields' : 'Message fields' }}</h2>
        <p class="section-caption">Fields specific to {{ message.name }}. Operation sections below explain when each field is used.</p>
        <div class="field-summary-table">
          <table>
            <thead><tr><th scope="col">Field</th><th scope="col">Type</th><th scope="col">Description</th></tr></thead>
            <tbody>
              <tr v-for="field in group.fields" :id="`message-${messageId}-${group.legacy ? 'legacy-' : ''}field-${field.id}`" :key="field.id">
                <th scope="row"><span class="summary-field-name">{{ field.name }}</span><span class="field-id">Field {{ field.id }}</span></th>
                <td><code>{{ field.type }}</code></td>
                <td>
                  <p v-if="field.description" class="prose">{{ field.description }}</p>
                  <p v-if="field.maxBytes !== undefined" class="field-limit">Maximum {{ field.maxBytes }} bytes</p>
                  <ul v-if="field.values.length" class="field-values">
                    <li v-for="value in field.values" :key="value.value"><code>{{ value.value }}</code><strong v-if="value.name"> {{ value.name }}</strong><span v-if="value.description">: {{ value.description }}</span></li>
                  </ul>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

    <section v-for="panel in group.panels" :id="panel.anchor" :key="panel.anchor" class="operation-section" :aria-labelledby="`${panel.anchor}-heading`">
      <span v-if="panel.variantId && panel.defaultVariant" :id="operationAnchor(panel.operation)" class="operation-anchor" aria-hidden="true"></span>
      <div class="operation-toolbar">
        <div class="wire-context" aria-label="Protocol context">
          <span class="protocol-label">V3 protocol</span>
          <span v-if="panel.operation.method" class="method-badge">{{ panel.operation.method }}</span>
          <span>Message {{ messageId }}</span>
          <span v-if="panel.variant.messageVersion !== undefined">Message Version {{ panel.variant.messageVersion }}</span>
        </div>

      </div>

      <div class="reference-columns">
        <div class="reference-description">
          <h2 :id="`${panel.anchor}-heading`" class="operation-heading">
            <a class="operation-heading-link" :href="`#${panel.anchor}`">{{ panel.operation.title }}</a>
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
            <span v-for="anchor in context.referenceAnchors" :id="anchor" :key="anchor" class="operation-anchor" aria-hidden="true"></span>
            <p v-if="context.messageId !== undefined && !context.acknowledgment" class="section-caption">Message {{ context.messageId }}<template v-if="context.messageName"> · {{ context.messageName }}</template></p>
            <p v-if="context.description" class="prose">{{ context.description }}</p>
            <p v-if="context.acknowledgment" class="acknowledgment-link"><a :href="acknowledgmentUrl">ACK message (MT5): packet format</a></p>
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
          <div v-if="!panel.variant.examples?.length" class="empty-examples">No wire example is documented for this operation.</div>
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
                  <Message :byte-string="frame.bytes" :yaml-data="yamlData" :default-collapsed="false" :show-generator-link="false" read-only />
                  <template #fallback><p class="section-caption">The interactive byte decoder is available after this page loads.</p></template>
                </ClientOnly>
              </details>
            </div>
          </article>

        </aside>
      </div>
    </section>
    </component>
    <p class="copy-status" role="status" aria-live="polite">{{ copyStatus }}</p>
    <section :id="`message-${messageId}-constants`" class="message-constants" :aria-labelledby="`message-${messageId}-constants-heading`">
      <h2 :id="`message-${messageId}-constants-heading`">Message and field constants</h2>
      <p class="section-caption">Identifiers for this message type and its fields. See the operation sections above for rules and limits.</p>
      <MessageCodeGen :key="messageId" :message-id="messageId" :yaml-data="constantsData" />
    </section>
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
.overview-notes { margin-top: 24px; max-width: 950px; }
.overview-note + .overview-note { margin-top: 20px; }
.overview-note h2 { border: 0; padding: 0; margin-bottom: 6px; font-size: 17px; }
.message-fields { margin-top: 28px; }
.message-fields h2 { border: 0; padding: 0; margin-bottom: 8px; font-size: 22px; }
.field-summary-table { width: 100%; margin-top: 16px; }
.field-summary-table table { display: table; width: 100%; margin: 0; border-collapse: collapse; font-size: 13px; }
.field-summary-table th, .field-summary-table td { padding: 12px 14px; text-align: left; vertical-align: top; border: 0; border-bottom: 1px solid var(--vp-c-divider); }
.field-summary-table thead th { background: var(--vp-c-bg-soft); font-size: 12px; font-weight: 600; }
.field-summary-table tbody tr { background: transparent; border: 0; }
.field-summary-table tbody th { min-width: 150px; width: 22%; font-weight: 600; }
.field-summary-table td:nth-child(2) { width: 15%; }
.summary-field-name, .field-summary-table .field-id { display: block; }
.field-summary-table .field-id { margin-top: 4px; }
.field-summary-table .field-limit { margin-top: 6px; font-size: 12px; }
.operation-heading-link { color: inherit; text-decoration: none; }
.operation-heading-link:hover { text-decoration: underline; text-underline-offset: 4px; }
.acknowledgment-link { margin-top: 8px !important; font-size: 13px; }
.legacy-reference { margin-top: 36px; border: 1px solid var(--vp-c-divider); border-radius: 8px; padding: 0 20px 20px; }
.legacy-reference > summary { padding: 18px 0 0; cursor: pointer; font-size: 16px; font-weight: 600; }
.legacy-reference:not([open]) { padding-bottom: 18px; }
.legacy-reference[open] > summary { margin-bottom: 12px; }
.legacy-introduction { font-size: 13px; }
.operation-anchor { display: block; height: 0; }
.operation-section { margin-top: 36px; padding-top: 24px; border-top: 1px solid var(--vp-c-divider); }
.operation-toolbar { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; padding: 0 0 16px; }
.wire-context { display: flex; align-items: center; gap: 8px 12px; flex-wrap: wrap; font-size: 12px; color: var(--reference-muted); }
.protocol-label { font-weight: 600; }
.method-badge { padding: 1px 7px; border: 1px solid var(--vp-c-divider); border-radius: 4px; font-family: var(--vp-font-family-mono); color: var(--reference-text); background: var(--vp-c-bg-soft); font-weight: 600; }
.reference-columns { display: grid; grid-template-columns: minmax(0, 1.04fr) minmax(0, 1fr); gap: 36px; align-items: start; }
.reference-description, .reference-examples { min-width: 0; }
.structured-message .operation-heading { padding: 0; border: 0; margin: 0 0 12px; font-size: 22px; line-height: 1.4; }
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
.message-constants { margin-top: 36px; padding-top: 24px; border-top: 1px solid var(--vp-c-divider); }
.message-constants h2 { border: 0; padding: 0; margin-bottom: 8px; font-size: 22px; }

.message-constants :deep(.protocol-constants-container) { margin: 12px 0 18px; border-color: var(--vp-c-divider); }
.message-constants :deep(.constants-header) { flex-wrap: wrap; gap: 8px; padding: 8px; background: var(--vp-c-bg-soft); }
.message-constants :deep(.language-tabs) { flex-wrap: wrap; gap: 4px; }
.message-constants :deep(.language-tab) { font-size: 11px; padding: 4px 7px; }
.message-constants :deep(.language-tab.active) { background: var(--vp-c-bg); border-color: var(--reference-accent); color: var(--reference-accent); }
.message-constants :deep(pre) { white-space: pre-wrap; overflow-wrap: anywhere; }
.structured-message :is(a, button, select, summary):focus-visible { outline: 2px solid var(--reference-accent); outline-offset: 4px; }
:global(.dark) .structured-message { --reference-accent: #eda577; }
@media (min-width: 1600px) { .structured-message { max-width: 1320px; } }
@media (max-width: 1100px) { .reference-columns { grid-template-columns: minmax(0, 1fr); gap: 32px; } }
@media (max-width: 639px) {
  .operation-toolbar { align-items: flex-start; }
  .field-summary-table th, .field-summary-table td { padding: 10px 8px; }
  .field-summary-table tbody th { min-width: 90px; width: 25%; }
  .field-summary-table td:nth-child(2) { width: auto; }
  .field-summary-table { overflow-wrap: anywhere; }
  .legacy-reference { padding-left: 12px; padding-right: 12px; }
  .structured-message .message-summary { font-size: 15px; }
  .reference-columns { gap: 28px; }
  .frame-heading { padding: 12px; }
  .example-header { padding: 14px 12px; }
  .structured-message .wire-bytes { padding: 12px; }
}
</style>
