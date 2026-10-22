<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { withBase } from 'vitepress'
import Message from './Message.vue'
import MessageCodeGen from './MessageCodeGen.vue'
import {
  documentationTargetOverride,
  getDocumentationFormat,
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
      formatId: documentation.value ? getDocumentationFormat(documentation.value, view)?.id : undefined,
      anchor,
      target: documentationTargetOverride(view.target, documentation.value?.target),
      examples: (view.examples || []).map(example => ({
        ...example,
        target: documentationTargetOverride(example.target, view.target || documentation.value?.target),
      })),
      contexts,
      errors: (view.errors || []).map(error => ({ ...error, name: props.yamlData.header?.[4]?.values?.[error.code]?.name })),
    }
  })
}))

// Format metadata owns the hierarchy. Operations without a wire format are
// shared, not implicitly part of the newest format. Every panel renders once.
const hasFormats = computed(() => !!documentation.value?.formats?.length)
const groups = computed(() => {
  const docs = documentation.value
  if (!docs?.formats?.length) {
    const standard = {
      id: 'standard',
      anchor: undefined,
      label: '',
      title: '',
      description: '',
      legacy: false,
      fields: resolveDocumentationFields(props.yamlData, message.value, docs?.fields, 'fields'),
      panels: panels.value.filter(panel => !panel.legacy),
    }
    const legacyFields = resolveDocumentationFields(props.yamlData, message.value, docs?.legacyFields, 'fields')
    const legacyPanels = panels.value.filter(panel => panel.legacy)
    return legacyFields.length || legacyPanels.length ? [standard, {
      id: 'legacy',
      anchor: `message-${props.messageId}-legacy`,
      label: 'Legacy',
      title: 'Legacy format',
      description: 'For existing integrations using this older format. Current-format fields and operations are documented above.',
      legacy: true,
      fields: legacyFields,
      panels: legacyPanels,
    }] : [standard]
  }

  const formats = docs.formats.map(format => ({
    id: format.id,
    anchor: `message-${props.messageId}-${format.legacy ? 'legacy' : `format-${format.id}`}`,
    label: format.label,
    title: `${format.label} format`,
    description: format.description,
    legacy: !!format.legacy,
    fields: resolveDocumentationFields(props.yamlData, message.value, format.legacy ? docs.legacyFields : docs.fields, 'fields'),
    panels: panels.value.filter(panel => panel.formatId === format.id),
  }))
  const sharedPanels = panels.value.filter(panel => !panel.formatId)
  return sharedPanels.length ? [...formats, {
    id: 'shared',
    anchor: `message-${props.messageId}-format-independent`,
    label: 'Any format',
    title: 'Format-independent operations',
    description: 'These operations do not select a message format.',
    legacy: false,
    fields: [],
    panels: sharedPanels,
  }] : formats
})

const overviewNotes = computed(() => documentation.value?.notes?.filter(note => note.placement !== 'reference') || [])
const referenceNotes = computed(() => documentation.value?.notes?.filter(note => note.placement === 'reference') || [])
const firstExamplesAnchor = computed(() => {
  const panel = groups.value.flatMap(group => group.panels).find(item => !item.legacy && item.examples.length)
  return panel ? `${panel.anchor}-examples` : undefined
})
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

async function revealHash(value: string) {
  let hash: string
  try { hash = decodeURIComponent(value.slice(1)) } catch { return }
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

function readHash() {
  void revealHash(window.location.hash)
}

function onAnchorClick(event: MouseEvent) {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
  const link = event.target instanceof Element ? event.target.closest('a[href]') : null
  if (!(link instanceof HTMLAnchorElement) || link.target === '_blank' || link.hasAttribute('download')) return
  const url = new URL(link.href, window.location.href)
  if (url.origin !== window.location.origin || url.pathname !== window.location.pathname || url.search !== window.location.search || !url.hash) return
  // Hashchange does not fire when the same anchor is clicked again. Handle any
  // same-page link, including links outside this component, before scrolling.
  void revealHash(url.hash)
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
  document.addEventListener('click', onAnchorClick)
})
onBeforeUnmount(() => {
  jumpBarObserver?.disconnect()
  window.removeEventListener('hashchange', readHash)
  document.removeEventListener('click', onAnchorClick)
})
</script>

<template>
  <div v-if="documentation" class="structured-message" :style="{ '--message-jump-height': `${jumpBarHeight}px` }">
    <p class="message-summary">{{ documentation.summary }}</p>
    <p v-if="documentation.target" class="support-context"><strong>Applies to</strong> {{ documentation.target }}</p>

    <nav ref="jumpBar" class="message-jump-bar" aria-label="Message formats and operations">
      <div class="jump-identity">
        <span class="jump-message"><strong>{{ message.name }}</strong><span class="jump-message-id">Message {{ messageId }}</span></span>
        <a v-if="firstExamplesAnchor" :href="`#${firstExamplesAnchor}`" class="examples-jump">First examples <span aria-hidden="true">↓</span></a>
      </div>
      <div class="jump-groups">
        <div v-for="group in groups" :key="group.id" class="jump-group" role="group" :aria-label="group.title || 'Operations'">
          <a v-if="group.anchor" :href="`#${group.anchor}`" class="format-jump" :class="{ 'format-jump-legacy': group.legacy }">{{ group.label }}<span v-if="group.legacy && group.label !== 'Legacy'" class="jump-legacy-label">Legacy</span></a>
          <span v-else class="jump-label">Operations</span>
          <a v-for="panel in group.panels" :key="panel.anchor" :href="`#${panel.anchor}`" :aria-label="`${group.label ? `${group.label}: ` : ''}${panel.operation.method || 'Upload'}: ${panel.operation.title}`" class="method-jump">
            <span class="method-badge" :class="methodClass(panel.operation.method)">{{ panel.operation.method || 'UPLOAD' }}</span>
          </a>
        </div>
      </div>
    </nav>

    <div v-if="overviewNotes.length" :id="`message-${messageId}-notes`" class="overview-notes">
      <section v-for="note in overviewNotes" :key="note.id" class="overview-note" :aria-labelledby="`message-${messageId}-note-${note.id}`">
        <h2 :id="`message-${messageId}-note-${note.id}`">{{ note.title }}</h2>
        <p class="prose">{{ note.description }}</p>
      </section>
    </div>

    <component
      :is="group.legacy ? 'details' : (hasFormats ? 'section' : 'div')"
      v-for="group in groups"
      :id="group.anchor"
      :key="group.id"
      class="reference-group"
      :class="{ 'legacy-reference': group.legacy, 'current-reference': !group.legacy, 'format-reference': hasFormats }"
      :aria-labelledby="hasFormats || group.legacy ? `${group.anchor}-heading` : undefined"
    >
      <summary v-if="group.legacy">
        <h2 :id="`${group.anchor}-heading`" class="format-heading"><span :id="`message-${messageId}-format-${group.id}`" class="format-anchor" aria-hidden="true"></span>{{ group.title }}<span class="format-status">Legacy</span></h2>
      </summary>
      <h2 v-else-if="hasFormats" :id="`${group.anchor}-heading`" class="format-heading">{{ group.title }}<span v-if="group.id !== 'shared'" class="format-status">Current</span></h2>
      <p v-if="group.description" class="format-description prose">{{ group.description }}</p>

      <section v-if="group.fields.length" :id="`message-${messageId}-${group.legacy ? 'legacy-' : ''}fields`" class="message-fields" :aria-labelledby="`message-${messageId}-${group.legacy ? 'legacy-' : ''}fields-heading`">
        <component :is="hasFormats || group.legacy ? 'h3' : 'h2'" :id="`message-${messageId}-${group.legacy ? 'legacy-' : ''}fields-heading`" class="fields-heading">{{ group.legacy ? 'Legacy fields' : 'Message fields' }}</component>
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
          <component :is="hasFormats || panel.legacy ? 'h3' : 'h2'" :id="`${panel.anchor}-heading`" class="operation-heading">
            <a class="operation-heading-link" :href="`#${panel.anchor}`">{{ panel.operation.title }}</a>
          </component>
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
            <component :is="hasFormats || panel.legacy ? 'h4' : 'h3'" :id="`${panel.anchor}-${context.role}`" class="context-heading">{{ context.title }}</component>
            <span v-for="anchor in context.referenceAnchors" :id="anchor" :key="anchor" class="operation-anchor" aria-hidden="true"></span>
            <p v-if="context.messageId !== undefined && !context.acknowledgment" class="section-caption">Message {{ context.messageId }}<template v-if="context.messageName"> · {{ context.messageName }}</template></p>
            <p v-if="context.description" class="prose">{{ context.description }}</p>
            <p v-if="context.acknowledgment" class="acknowledgment-link"><a :href="acknowledgmentUrl">ACK message (MT5): packet format</a></p>
            <div v-for="group in context.groups" :key="group.kind" class="field-group" :class="{ 'header-group': group.kind === 'headers' }">
              <component :is="hasFormats || panel.legacy ? 'h5' : 'h4'" class="field-group-heading">{{ group.title }}</component>
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
            <component :is="hasFormats || panel.legacy ? 'h4' : 'h3'" :id="`${panel.anchor}-errors`" class="context-heading">Errors</component>
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
          <component :is="hasFormats || panel.legacy ? 'h4' : 'h3'" :id="`${panel.anchor}-examples`" class="examples-heading">Wire examples</component>
          <p class="examples-caption">{{ panel.operation.title }}<template v-if="panel.variantId"> · {{ panel.variant.title }}</template>. Complete V3 frames, not HTTP requests.</p>
          <div v-if="!panel.examples.length" class="empty-examples">No wire example is documented for this operation.</div>
          <article
            v-for="(example, exampleIndex) in panel.examples"
            :id="`${panel.anchor}-example-${exampleIndex + 1}`"
            :key="`${panel.anchor}-${exampleIndex}`"
            class="example-card"
            :aria-labelledby="`${panel.anchor}-example-${exampleIndex + 1}-title`"
          >
            <header class="example-header">
              <span class="example-provenance">{{ example.provenance === 'generated' ? 'Synthetic example' : 'Captured example' }}</span>
              <component :is="hasFormats || panel.legacy ? 'h5' : 'h4'" :id="`${panel.anchor}-example-${exampleIndex + 1}-title`" class="example-title">{{ example.title }}</component>
              <p v-if="example.description" class="prose">{{ example.description }}</p>
              <p v-if="example.target" class="example-target"><strong>Target</strong> {{ example.target }}</p>
              <p v-if="example.provenance === 'generated'" class="provenance-note">Generated for illustration; not a device capture.</p>
            </header>
            <div v-for="(frame, frameIndex) in example.frames" :key="frameIndex" class="example-frame" :class="`frame-${frame.role}`">
              <div class="frame-heading">
                <component :is="hasFormats || panel.legacy ? 'h6' : 'h5'" :id="`${panel.anchor}-example-${exampleIndex + 1}-frame-${frameIndex + 1}`" class="frame-title"><span class="frame-role">{{ frame.role }}</span>{{ frame.label }}</component>
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
.structured-message :is(h2, h3, h4, h5, h6, p, dl, dd, ul) { margin: 0; }
.structured-message :is(h2, h3, h4, h5, h6) { color: var(--reference-text); letter-spacing: -.015em; }
.structured-message p { color: var(--reference-muted); }
.structured-message [id] { scroll-margin-top: calc(var(--message-sticky-top) + var(--message-jump-height, 64px) + 24px); }
.structured-message .message-summary { margin: 16px 0 10px; font-size: 16px; line-height: 1.8; white-space: pre-line; }
.support-context { font-size: 12px; }
.support-context strong, .target-context strong, .example-target strong { margin-right: 8px; font-weight: 600; }
.message-jump-bar { position: sticky; top: var(--message-sticky-top); z-index: 10; min-width: 0; margin: 22px 0; padding: 8px 12px; border: 1px solid var(--vp-c-divider); border-radius: 7px; background: var(--vp-c-bg); box-shadow: 0 3px 10px rgba(20, 35, 50, .06); }
.jump-identity { display: flex; align-items: center; justify-content: space-between; gap: 8px 16px; min-width: 0; margin-bottom: 4px; }
.jump-message { display: flex; align-items: baseline; flex-wrap: wrap; gap: 2px 10px; min-width: 0; font-size: 13px; line-height: 1.5; }
.jump-message-id { color: var(--reference-muted); font-size: 11px; white-space: nowrap; }
.jump-groups { display: flex; flex-wrap: wrap; align-items: center; gap: 2px 12px; min-width: 0; }
.jump-group { display: flex; align-items: center; flex: 0 1 auto; min-width: 0; max-width: 100%; gap: 5px; padding: 3px 2px; overflow-x: auto; overscroll-behavior-x: contain; scrollbar-width: thin; }
.jump-group > * { flex: 0 0 auto; }
.jump-label { font-size: 11px; color: var(--reference-muted); margin-right: 3px; }
.format-jump { display: inline-flex; align-items: center; gap: 5px; padding: 3px 5px; border-radius: 4px; color: var(--reference-text); font-size: 12px; font-weight: 650; white-space: nowrap; text-decoration: none; }
.format-jump:hover { background: var(--vp-c-bg-soft); }
.jump-legacy-label { color: var(--reference-muted); font-size: 10px; font-weight: 400; }
.method-jump { display: inline-flex; border-radius: 4px; text-decoration: none; }
.method-jump .method-badge { font-size: 10px; padding: 3px 6px; border-radius: 4px; }
.method-jump:hover .method-badge { box-shadow: 0 0 0 2px var(--vp-c-divider); }
.examples-jump { flex-shrink: 0; padding: 3px 5px; border-radius: 4px; color: var(--reference-muted); font-size: 11px; text-decoration: none; white-space: nowrap; }
.examples-jump:hover { color: var(--reference-accent); }
.structured-message .jump-group a:focus-visible { outline-offset: -2px; }
.reference-notes { margin-top: 36px; padding-top: 24px; border-top: 1px solid var(--vp-c-divider); }
.reference-note + .reference-note { margin-top: 22px; }
.reference-note h2 { border: 0; padding: 0; margin-bottom: 8px; font-size: 18px; }
.overview-notes { margin-top: 24px; }
.overview-note + .overview-note { margin-top: 20px; }
.overview-note h2 { border: 0; padding: 0; margin-bottom: 6px; font-size: 17px; }
.message-fields { margin-top: 28px; }
.message-fields .fields-heading { border: 0; padding: 0; margin-bottom: 8px; font-size: 22px; }
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
.format-reference { margin-top: 36px; padding-top: 24px; border-top: 1px solid var(--vp-c-divider); }
.structured-message .format-heading { border: 0; padding: 0; margin-bottom: 8px; font-size: 24px; line-height: 1.5; }
.format-status { display: inline-block; margin-left: 10px; padding: 1px 7px; border: 1px solid var(--vp-c-divider); border-radius: 4px; color: var(--reference-muted); font-size: 10px; font-weight: 500; letter-spacing: .02em; vertical-align: middle; }
.format-description { font-size: 13px; }
.format-anchor { display: inline-block; width: 0; }
.legacy-reference { border: 1px solid var(--vp-c-divider); border-radius: 8px; padding: 0 20px 20px; }
.legacy-reference > summary { padding: 16px 0 0; cursor: pointer; }
.legacy-reference > summary .format-heading { display: inline; font-size: 22px; }
.legacy-reference:not([open]) { padding-bottom: 16px; }
.legacy-reference[open] > summary { margin-bottom: 12px; }
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
.context-section .context-heading { font-size: 18px; margin-bottom: 10px; }
.field-group { margin-top: 18px; }
.field-group .field-group-heading { font-size: 12px; font-weight: 700; color: var(--reference-muted); text-transform: uppercase; letter-spacing: .06em; }
.header-group { padding: 12px; border: 1px solid var(--vp-c-divider); border-left: 3px solid #7895b5; border-radius: 5px; background: var(--vp-c-bg-soft); }
.header-group .field-group-heading { color: var(--reference-text); }
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
.example-header .example-title { font-size: 16px; line-height: 1.5; margin-bottom: 8px; }
.example-header p { font-size: 12px; }
.example-target { margin-top: 8px !important; }
.provenance-note { margin-top: 8px !important; font-size: 11px !important; }
.example-frame { border-top: 1px solid var(--vp-c-divider); }
.frame-heading { background: var(--vp-c-bg-alt); display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; padding: 12px 16px; }
.frame-heading .frame-title { display: flex; align-items: baseline; flex-wrap: wrap; gap: 4px 10px; font-size: 12px; }
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
@media (max-width: 1100px) { .reference-columns { grid-template-columns: minmax(0, 1fr); gap: 32px; } }
@media (max-width: 959px) {
  .structured-message { --message-sticky-top: calc(var(--vp-layout-top-height, 0px) + 48px); }
}
@media (max-width: 639px) {
  .message-jump-bar { padding: 8px; }
  .jump-groups { display: grid; grid-template-columns: minmax(0, 1fr); gap: 0; }
  .jump-group { width: 100%; }
  .jump-message { gap: 0 8px; }
  .jump-message strong { font-size: 12px; }
  .examples-jump { font-size: 10px; }
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
