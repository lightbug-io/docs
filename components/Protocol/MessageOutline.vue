<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { messageOutlineTrail, type MessageOutlineEntry } from '../../utils/MessageAnchor'

const props = defineProps<{
  entries: MessageOutlineEntry[]
  activeId: string
  messageId: number
  messageName: string
}>()
const open = ref(false)
const root = ref<HTMLElement | null>(null)
const trigger = ref<HTMLButtonElement | null>(null)
const list = ref<HTMLElement | null>(null)
const current = computed(() => props.entries.find(entry => entry.id === props.activeId) || props.entries[0])
const trail = computed(() => messageOutlineTrail(props.entries, current.value?.id || ''))
const ancestors = computed(() => trail.value.slice(0, -1))
const contextLabel = computed(() => ancestors.value.map(entry => entry.label || entry.title).join(' › '))
const listId = computed(() => `message-${props.messageId}-outline`)

function close(restoreFocus = false) {
  open.value = false
  if (restoreFocus) trigger.value?.focus()
}

async function showCurrent() {
  await nextTick()
  const container = list.value
  const active = container?.querySelector<HTMLElement>('[aria-current="location"]')
  if (!container || !active || !container.getClientRects().length) return
  // Scroll only the outline, never the document or a reference example.
  const bounds = container.getBoundingClientRect()
  const item = active.getBoundingClientRect()
  if (item.top < bounds.top + 12) container.scrollTop -= bounds.top + 12 - item.top
  else if (item.bottom > bounds.bottom - 12) container.scrollTop += item.bottom - bounds.bottom + 12
}

async function onTriggerKeydown(event: KeyboardEvent) {
  if (!['ArrowDown', 'ArrowUp'].includes(event.key)) return
  event.preventDefault()
  open.value = true
  await nextTick()
  const links = list.value?.querySelectorAll<HTMLAnchorElement>('a')
  const active = list.value?.querySelector<HTMLAnchorElement>('[aria-current="location"]')
  const target = active || links?.[event.key === 'ArrowUp' ? links.length - 1 : 0]
  target?.focus()
}

function onListKeydown(event: KeyboardEvent) {
  if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return
  const links = Array.from(list.value?.querySelectorAll<HTMLAnchorElement>('a') || [])
  const index = links.indexOf(document.activeElement as HTMLAnchorElement)
  if (index < 0) return
  event.preventDefault()
  const next = event.key === 'Home' ? 0 : event.key === 'End' ? links.length - 1
    : Math.max(0, Math.min(links.length - 1, index + (event.key === 'ArrowDown' ? 1 : -1)))
  links[next]?.focus()
}

function onEscape(event: KeyboardEvent) {
  if (event.key === 'Escape' && open.value) {
    event.preventDefault()
    close(true)
  }
}
function onOutsideClick(event: PointerEvent) {
  if (event.target instanceof Node && !root.value?.contains(event.target)) close()
}
function onFocusOut(event: FocusEvent) {
  if (event.relatedTarget instanceof Node && !root.value?.contains(event.relatedTarget)) close()
}
function onSelect(event: MouseEvent) {
  if (event.button || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
  if (open.value) close(event.detail === 0)
}
function onResize() {
  close()
  void showCurrent()
}
watch(() => props.messageId, () => close())
watch(() => props.activeId, showCurrent)
watch(open, value => { if (value) void showCurrent() })
onMounted(() => {
  document.addEventListener('pointerdown', onOutsideClick)
  document.addEventListener('keydown', onEscape)
  window.addEventListener('resize', onResize)
})
onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', onOutsideClick)
  document.removeEventListener('keydown', onEscape)
  window.removeEventListener('resize', onResize)
})
</script>

<template>
  <nav ref="root" class="message-outline" aria-label="On this page" @focusout="onFocusOut">
    <div class="outline-wide-identity"><strong>{{ messageName }}</strong><span>Message {{ messageId }}</span></div>
    <div class="message-outline-bar" data-message-navigation-bar>
      <div class="outline-identity"><strong>{{ messageName }}</strong><span>Message {{ messageId }}</span></div>
      <button ref="trigger" class="outline-trigger" type="button" :aria-expanded="open" :aria-controls="listId" @click="open = !open" @keydown="onTriggerKeydown">
        <span class="outline-label">On this page</span>
        <span class="outline-current" :title="trail.map(entry => entry.title).join(' › ')">
          <span v-if="contextLabel" class="outline-context">{{ contextLabel }} ›</span>
          <span class="outline-section">{{ current?.label || current?.title || 'Overview' }}</span>
        </span>
        <span class="outline-chevron" :class="{ expanded: open }" aria-hidden="true">⌄</span>
      </button>
    </div>
    <div :id="listId" ref="list" class="outline-list" :class="{ open }" @keydown="onListKeydown">
      <div class="outline-title">On this page</div>
      <ul>
        <li v-for="entry in entries" :key="entry.id" :style="{ '--outline-depth': entry.depth }">
          <a :href="`#${entry.id}`" :aria-current="entry.id === current?.id ? 'location' : undefined" :class="{ 'active-ancestor': ancestors.some(parent => parent.id === entry.id) }" @click="onSelect">{{ entry.title }}</a>
        </li>
      </ul>
    </div>
  </nav>
</template>

<style scoped>
.message-outline { position: relative; font-size: 13px; line-height: 1.5; }
.outline-wide-identity { display: none; }
.message-outline-bar { padding: 10px 0; border-bottom: 1px solid var(--vp-c-divider); background: var(--vp-c-bg); }
.outline-identity { display: flex; flex-wrap: wrap; align-items: baseline; gap: 2px 10px; padding: 0 8px; font-size: 12px; }
.outline-identity strong { font-weight: 600; }
.outline-identity > span { color: var(--vp-c-text-2); font-size: 11px; white-space: nowrap; }
.outline-trigger { display: flex; align-items: center; gap: 10px; width: 100%; padding: 5px 8px 0; text-align: left; }
.outline-label { flex-shrink: 0; color: var(--vp-c-text-2); font-size: 12px; }
.outline-current { display: flex; gap: 4px; min-width: 0; color: var(--vp-c-brand-1); }
.outline-context { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.outline-section { flex-shrink: 0; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.outline-chevron { margin-left: auto; flex-shrink: 0; }
.outline-chevron.expanded { transform: rotate(180deg); }
.outline-list { display: none; position: absolute; top: 100%; right: 0; left: 0; max-height: min(65vh, calc(100dvh - var(--message-sticky-top) - var(--message-jump-height) - 24px)); overflow-y: auto; overscroll-behavior: contain; padding: 12px 16px; border: 1px solid var(--vp-c-divider); border-radius: 0 0 8px 8px; background: var(--vp-c-bg); box-shadow: 0 12px 24px rgba(0, 0, 0, .1); }
.outline-list.open { display: block; }
.outline-title { display: none; font-size: 14px; font-weight: 600; line-height: 32px; }
.message-outline ul { margin: 0; padding: 0; list-style: none; border-left: 1px solid var(--vp-c-divider); }
.message-outline li { margin: 0; padding: 0; }
.message-outline a { position: relative; display: block; padding: 5px 0 5px calc(16px + var(--outline-depth) * 12px); color: var(--vp-c-text-2); text-decoration: none; font-size: 12px; line-height: 1.5; overflow-wrap: anywhere; transition: color .2s; }
.message-outline a.active-ancestor { color: var(--vp-c-text-1); font-weight: 600; }
.message-outline a:hover { color: var(--vp-c-text-1); }
.message-outline a[aria-current] { color: var(--vp-c-brand-1); font-weight: 600; }
.message-outline a[aria-current]::before { position: absolute; top: 7px; bottom: 7px; left: -1px; width: 2px; border-radius: 2px; background: var(--vp-c-brand-1); content: ''; }
.message-outline :is(a, button):focus-visible { outline: 2px solid var(--vp-c-brand-1); outline-offset: 2px; }
@media (min-width: 1440px) {
  .message-outline { display: flex; flex-direction: column; max-height: calc(100dvh - var(--message-sticky-top) - 32px); }
  .outline-wide-identity { display: flex; flex-direction: column; flex-shrink: 0; gap: 2px; padding: 0 4px 12px 16px; border-left: 1px solid var(--vp-c-divider); font-size: 12px; }
  .outline-wide-identity strong { font-weight: 600; }
  .outline-wide-identity > span { color: var(--vp-c-text-2); font-size: 11px; }
  .message-outline-bar { display: none; }
  .outline-list { display: block; position: static; min-height: 0; max-height: none; padding: 0 4px 12px 0; border: 0; border-radius: 0; box-shadow: none; scrollbar-width: thin; }
  .outline-title { display: block; padding-left: 16px; border-left: 1px solid var(--vp-c-divider); }
}
</style>
