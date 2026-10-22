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
const jumpBar = ref<HTMLElement | null>(null)
const jumpBarHeight = ref(64)
let jumpBarObserver: ResizeObserver | undefined
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

const overviewNotes = computed(() => documentation.value?.notes?.filter(note => note.placement !== 'reference') || [])
const referenceNotes = computed(() => documentation.value?.notes?.filter(note => note.placement === 'reference') || [])
const methodLinks = computed(() => (documentation.value?.operations || []).filter(item =>
  panels.value.some(panel => panel.operation.id === item.id && !panel.legacy)))
const firstExamplesAnchor = computed(() => {
  const panel = panels.value.find(item => !item.legacy && item.variant.examples?.length)
  return panel ? `${panel.anchor}-examples` : undefined
})
const hasLegacy = computed(() => groups.value.some(group => group.legacy))
const versionLabel = (legacy: boolean) => {
  const versions = [...new Set(panels.value.filter(panel => panel.legacy === legacy)
    .map(panel => panel.variant.messageVersion).filter(version => version !== undefined))]
    .sort((a, b) => a! - b!)
  return versions.length ? `Version${versions.length > 1 ? 's' : ''} ${versions.join(', ')}` : `${legacy ? 'Legacy' : 'Current'} format`
}
const methodClass = (method?: string) => `method-${(method || 'upload').toLowerCase()}`

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
  jumpBarHeight.value = jumpBar.value?.getBoundingClientRect().height || 64
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
  if (typeof ResizeObserver !== 'undefined') {
    jumpBarObserver = new ResizeObserver(() => {
      jumpBarHeight.value = jumpBar.value?.getBoundingClientRect().height || 64
    })
    if (jumpBar.value) jumpBarObserver.observe(jumpBar.value)
  }
  window.addEventListener('hashchange', readHash)
})
onBeforeUnmount(() => {
  jumpBarObserver?.disconnect()
  window.removeEventListener('hashchange', readHash)
})
</script>

<template>
  <div v-if="documentation" class="structured-message" :style="{ '--message-jump-height': `${jumpBarHeight}px` }">
    <p class="message-summary">{{ documentation.summary }}</p>
    <p v-if="documentation.target" class="support-context"><strong>Applies to</strong> {{ documentation.target }}</p>

    <nav v-if="hasLegacy" class="version-navigation" aria-label="Message versions">
      <span class="version-navigation-label">Message format</span>
      <a :href="`#message-${messageId}-fields`" class="version-link version-current"><strong>{{ versionLabel(false) }}</strong><span>Current reference</span></a>
      <a :href="`#message-${messageId}-legacy`" class="version-link"><strong>{{ versionLabel(true) }}</strong><span>Legacy reference</span></a>
      <p>The current format is documented below. Legacy fields and examples are collapsed in a separate section.</p>
    </nav>

    <nav ref="jumpBar" class="message-jump-bar" aria-label="Jump to a method or example">
      <span class="jump-label">Jump to</span>
      <a v-for="item in methodLinks" :key="item.id" :href="`#${operationAnchor(item)}`" :aria-label="`${item.method || 'Upload'}: ${item.title}`" class="method-jump">
        <span class="method-badge" :class="methodClass(item.method)">{{ item.method || 'UPLOAD' }}</span>
      </a>
      <a v-if="firstExamplesAnchor" :href="`#${firstExamplesAnchor}`" class="examples-jump">First examples <span aria-hidden="true">↓</span></a>
    </nav>

    <div v-if="overviewNotes.length" :id="`message-${messageId}-notes`" class="overview-notes">
      <section v-for="note in overviewNotes" :key="note.id" class="overview-note" :aria-labelledby="`message-${messageId}-note-${note.id}`">
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
      <summary v-if="group.legacy">Legacy {{ versionLabel(true).toLowerCase() }}: fields and operations</summary>
      <p v-if="group.legacy" class="legacy-introduction">For existing integrations using this older format. Current-format fields and operations are documented above.</p>

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
          <span class="method-badge" :class="methodClass(panel.operation.method)">{{ panel.operation.method || 'UPLOAD' }}</span>
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
            :class="`context-${context.role}`"
            :aria-labelledby="`${panel.anchor}-${context.role}`"
          >
            <h3 :id="`${panel.anchor}-${context.role}`">{{ context.title }}</h3>
            <span v-for="anchor in context.referenceAnchors" :id="anchor" :key="anchor" class="operation-anchor" aria-hidden="true"></span>
            <p v-if="context.messageId !== undefined && !context.acknowledgment" class="section-caption">Message {{ context.messageId }}<template v-if="context.messageName"> · {{ context.messageName }}</template></p>
            <p v-if="context.description" class="prose">{{ context.description }}</p>
            <p v-if="context.acknowledgment" class="acknowledgment-link"><a :href="acknowledgmentUrl">ACK message (MT5): packet format</a></p>
            <div v-for="group in context.groups" :key="group.kind" class="field-group" :class="{ 'header-group': group.kind === 'headers' }">
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
            <div v-for="(frame, frameIndex) in example.frames" :key="frameIndex" class="example-frame" :class="`frame-${frame.role}`">
              <div class="frame-heading">
                <h4 :id="`${panel.anchor}-example-${exampleIndex + 1}-frame-${frameIndex + 1}`"><span class="frame-role">{{ frame.role }}</span>{{ frame.label }}</h4>
                <button type="button" class="copy-button" :aria-label="`Copy bytes: ${example.title}, ${frame.label}`" @click="copyBytes(frame.bytes, frame.label)">Copy</button>
              </div>
              <div class="annotated-frame" :aria-labelledby="`${panel.anchor}-example-${exampleIndex + 1}-frame-${frameIndex + 1}`">
                <Message :byte-string="frame.bytes" :yaml-data="yamlData" :default-collapsed="false" :show-generator-link="false" :show-controls="false" read-only />
              </div>
              <details class="raw-bytes-details">
                <summary>Raw bytes</summary>
                <pre class="wire-bytes"><code>{{ frame.bytes }}</code></pre>
              </details>
            </div>
          </article>

        </aside>
      </div>
    </section>
    </component>
    <p class="copy-status" role="status" aria-live="polite">{{ copyStatus }}</p>
    <div v-if="referenceNotes.length" :id="overviewNotes.length ? undefined : `message-${messageId}-notes`" class="reference-notes">
      <section v-for="note in referenceNotes" :key="note.id" class="reference-note" :aria-labelledby="`message-${messageId}-note-${note.id}`">
        <h2 :id="`message-${messageId}-note-${note.id}`">{{ note.title }}</h2>
        <p class="prose">{{ note.description }}</p>
      </section>
    </div>
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
  --message-sticky-top: calc(var(--vp-nav-height, 64px) + var(--vp-layout-top-height, 0px));
  color: var(--reference-text);
  font-size: 14px;
  line-height: 1.75;
}
.structured-message :is(h2, h3, h4, p, dl, dd, ul) { margin: 0; }
.structured-message :is(h2, h3, h4) { color: var(--reference-text); letter-spacing: -.015em; }
.structured-message p { color: var(--reference-muted); }
.structured-message [id] { scroll-margin-top: calc(var(--message-sticky-top) + var(--message-jump-height, 64px) + 24px); }
.structured-message .message-summary { max-width: 850px; margin: 16px 0 10px; font-size: 16px; line-height: 1.8; white-space: pre-line; }
.support-context { font-size: 12px; }
.support-context strong, .target-context strong, .example-target strong { margin-right: 8px; font-weight: 600; }
.version-navigation { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-top: 22px; padding: 14px 16px; border: 1px solid var(--vp-c-divider); border-radius: 7px; background: var(--vp-c-bg-soft); }
.version-navigation-label { font-size: 12px; font-weight: 600; margin-right: 4px; }
.version-link { display: flex; flex-direction: column; padding: 7px 12px; border: 1px solid var(--vp-c-divider); border-radius: 5px; color: var(--reference-text); background: var(--vp-c-bg); text-decoration: none; line-height: 1.5; }
.version-link strong { font-size: 13px; }
.version-link span { color: var(--reference-muted); font-size: 11px; }
.version-current { border-left: 3px solid #45836a; }
.version-navigation p { flex-basis: 100%; font-size: 12px; }
.message-jump-bar { position: sticky; top: var(--message-sticky-top); z-index: 10; display: flex; align-items: center; flex-wrap: wrap; gap: 8px; margin: 24px 0; padding: 10px 12px; border: 1px solid var(--vp-c-divider); border-radius: 7px; background: var(--vp-c-bg); box-shadow: 0 3px 10px rgba(20, 35, 50, .06); }
.jump-label { font-size: 11px; color: var(--reference-muted); margin-right: 3px; }
.method-jump { display: inline-flex; border-radius: 5px; text-decoration: none; }
.method-jump .method-badge { font-size: 11px; padding: 4px 7px; }
.method-jump:hover .method-badge { box-shadow: 0 0 0 2px var(--vp-c-divider); }
.examples-jump { margin-left: auto; padding: 5px 8px; border: 1px solid var(--vp-c-divider); border-radius: 5px; color: var(--reference-text); font-size: 12px; font-weight: 600; text-decoration: none; }
.examples-jump:hover, .version-link:hover { border-color: var(--reference-accent); }
.reference-notes { margin-top: 36px; padding-top: 24px; border-top: 1px solid var(--vp-c-divider); }
.reference-note + .reference-note { margin-top: 22px; }
.reference-note h2 { border: 0; padding: 0; margin-bottom: 8px; font-size: 18px; }
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
.operation-section { margin-top: 48px; padding-top: 28px; border-top: 3px solid var(--vp-c-divider); }
.operation-toolbar { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; padding: 0 0 16px; }
.wire-context { display: flex; align-items: center; gap: 8px 12px; flex-wrap: wrap; font-size: 12px; color: var(--reference-muted); }
.method-badge { display: inline-block; padding: 6px 11px; border: 1px solid transparent; border-radius: 6px; font-family: var(--vp-font-family-mono); color: #fff; background: #465766; font-size: 15px; line-height: 1.4; font-weight: 700; letter-spacing: .03em; }
.method-get { background: #176047; }
.method-set { background: #1d4d9b; }
.method-subscribe { background: #663e9a; }
.method-unsubscribe { background: #87551b; }
.method-upload { background: #036570; }
.reference-columns { display: grid; grid-template-columns: minmax(0, 1.04fr) minmax(0, 1fr); gap: 36px; align-items: start; }
.reference-description, .reference-examples { min-width: 0; }
.structured-message .operation-heading { padding: 0; border: 0; margin: 0 0 12px; font-size: 22px; line-height: 1.4; }
.prose { white-space: pre-line; overflow-wrap: anywhere; }
.reference-description > .prose + .prose { margin-top: 12px; }
.structured-message .target-context { margin-top: 16px; border-left: 2px solid var(--vp-c-divider); padding-left: 12px; font-size: 12px; }
.context-section { margin-top: 24px; padding: 18px; border: 1px solid var(--vp-c-divider); border-top-width: 3px; border-radius: 7px; }
.context-request { border-top-color: #557caa; }
.context-response { border-top-color: #45836a; }
.context-publication { border-top-color: #8965aa; }
.error-section { border-top-color: #ad7950; }
.context-section h3 { font-size: 18px; margin-bottom: 10px; }
.field-group { margin-top: 18px; }
.field-group h4 { font-size: 12px; font-weight: 700; color: var(--reference-muted); text-transform: uppercase; letter-spacing: .06em; }
.header-group { padding: 12px; border: 1px solid var(--vp-c-divider); border-left: 3px solid #7895b5; border-radius: 5px; background: var(--vp-c-bg-soft); }
.header-group h4 { color: var(--reference-text); }
.header-group .field-row:last-child { padding-bottom: 0; }
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
.frame-heading { background: var(--vp-c-bg-alt); display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; padding: 12px 16px; }
.frame-heading h4 { display: flex; align-items: baseline; flex-wrap: wrap; gap: 4px 10px; font-size: 12px; }
.frame-role { display: inline-block; padding: 2px 6px; border-radius: 3px; color: #fff; background: #465766; text-transform: uppercase; font-size: 10px; letter-spacing: .07em; font-weight: 700; }
.frame-request .frame-role { background: #1d4d9b; }
.frame-response .frame-role { background: #176047; }
.frame-publication .frame-role { background: #663e9a; }
.frame-upload .frame-role { background: #036570; }
.copy-button { border: 1px solid var(--vp-c-divider); border-radius: 4px; padding: 2px 8px; font-size: 11px; color: var(--reference-text); white-space: nowrap; }
.copy-button:hover { background: var(--vp-c-bg); }
.structured-message .wire-bytes { margin: 0; padding: 14px 16px; background: #202c3d; color: #e0e8f1; font-size: 12px; line-height: 1.9; white-space: pre-wrap; overflow-wrap: anywhere; word-break: break-word; }
.structured-message .wire-bytes code { padding: 0; border-radius: 0; background: none; color: inherit; font-size: inherit; }
.annotated-frame { padding: 0 12px 12px; background: var(--vp-c-bg); }
.annotated-frame :deep(.protocol-bytes-container) { margin: 0; border: 0; border-radius: 0; }
.annotated-frame :deep(.byte-header) { padding: 12px 0 0; background: transparent; }
.annotated-frame :deep(.byte-visualization-wrapper) { width: 100%; }
.annotated-frame :deep(.annotation-label) { color: var(--reference-text); }
.annotated-frame :deep(.annotation-value), .annotated-frame :deep(.annotation-detail) { color: var(--reference-muted); }
.raw-bytes-details { background: var(--vp-c-bg); }
.raw-bytes-details summary { padding: 8px 16px 12px; color: var(--reference-muted); font-size: 12px; cursor: pointer; }
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
@media (max-width: 959px) {
  .structured-message { --message-sticky-top: calc(var(--vp-layout-top-height, 0px) + 48px); }
}
@media (max-width: 639px) {
  .message-jump-bar { gap: 6px; padding: 8px; }
  .examples-jump { margin-left: 0; }
  .context-section { padding: 14px 12px; }
  .header-group { padding: 10px; }
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
