<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'
import { useData } from 'vitepress'
import * as CookieConsent from 'vanilla-cookieconsent'
import 'vanilla-cookieconsent/dist/cookieconsent.css'
import { configureAnalytics, setAnalyticsConsent } from '../../utils/Analytics'

declare const __DOCS_ANALYTICS_ID__: string
declare const __DOCS_DEPLOYMENT__: string
declare const __DOCS_PREVIEW__: boolean
const { site } = useData()
const preview = __DOCS_PREVIEW__
let dispose = () => {}
onBeforeUnmount(() => dispose())

onMounted(() => {
  configureAnalytics(__DOCS_ANALYTICS_ID__, __DOCS_DEPLOYMENT__, preview)
  const sync = () => setAnalyticsConsent(CookieConsent.acceptedCategory('analytics'))
  const storageKey = `docs-consent-change:${site.value.base}`
  const readChoice = () => document.cookie.split('; ').find(cookie => cookie.startsWith('docs_consent=')) || ''
  let lastChoice = readChoice()
  const refresh = () => {
    if (readChoice() === lastChoice) return
    // Another tab changed the shared cookie. Stop this tab before re-reading it.
    setAnalyticsConsent(false)
    window.location.reload()
  }
  const onStorage = (event: StorageEvent) => { if (event.key === storageKey) refresh() }
  window.addEventListener('storage', onStorage)
  window.addEventListener('focus', refresh)
  dispose = () => {
    window.removeEventListener('storage', onStorage)
    window.removeEventListener('focus', refresh)
  }
  CookieConsent.run({
    mode: 'opt-in',
    revision: 1,
    hideFromBots: false,
    manageScriptTags: false,
    cookie: { name: 'docs_consent', path: site.value.base, expiresAfterDays: 182 },
    guiOptions: {
      consentModal: { layout: 'box wide', position: 'bottom right', equalWeightButtons: true },
      preferencesModal: { layout: 'box', equalWeightButtons: true },
    },
    onConsent: () => { lastChoice = readChoice(); sync() },
    onChange: () => {
      lastChoice = readChoice()
      // Notify other tabs without storing a consent copy or personal data.
      try { localStorage.setItem(storageKey, String(Date.now())) } catch { /* focus check remains available */ }
      sync()
    },
    categories: {
      necessary: { enabled: true, readOnly: true },
      analytics: { enabled: false },
    },
    language: {
      default: 'en',
      translations: {
        en: {
          consentModal: {
            title: 'Your privacy choices',
            description: 'Optional Google Analytics helps us understand visits to these docs and use of the protocol tools and API examples. It stays off unless you accept. You can change your choice at any time.' + (preview ? '<br><strong>Preview only:</strong> analytics stays off here, even if you accept.' : ''),
            acceptAllBtn: 'Accept analytics',
            acceptNecessaryBtn: 'Reject analytics',
            showPreferencesBtn: 'Manage preferences',
            footer: '<a href="https://lightbug.io/privacy-policy/">Privacy policy</a>',
          },
          preferencesModal: {
            title: 'Privacy preferences',
            acceptAllBtn: 'Accept analytics',
            acceptNecessaryBtn: 'Reject analytics',
            savePreferencesBtn: 'Save preferences',
            closeIconLabel: 'Close preferences',
            sections: [
              { title: 'You are in control', description: 'The docs work without analytics. Withdrawing consent stops future analytics and clears accessible Google Analytics cookies; it does not erase information already sent. If analytics was loaded, this page reloads to stop it completely.' },
              { title: 'Essential preferences', description: 'A first-party docs_consent cookie remembers this choice for up to 182 days. The site also remembers your display preferences.', linkedCategory: 'necessary' },
              { title: 'Google Analytics', description: 'When enabled on the live docs, Google receives visit and browser information plus protocol tool events (message type, message name and byte count) and API example use (operation ID). These tool events do not include message contents. Google Analytics may set _ga cookies.' + (preview ? '<br><strong>This preview sends no analytics, regardless of your choice.</strong>' : ''), linkedCategory: 'analytics' },
              { title: 'More information', description: '<a href="https://lightbug.io/privacy-policy/">Privacy policy</a>.' },
            ],
          },
        },
      },
    },
  }).then(() => {
    // Expired or absent consent must not leave old analytics cookies behind.
    if (!CookieConsent.acceptedCategory('analytics')) setAnalyticsConsent(false)
  })
})
</script>

<template>
  <button class="docs-privacy-control" type="button" @click="CookieConsent.showPreferences()">Privacy preferences</button>
</template>

<style>
#cc-main {
  --cc-font-family: var(--vp-font-family-base);
  --cc-bg: var(--vp-c-bg);
  --cc-primary-color: var(--vp-c-text-1);
  --cc-secondary-color: var(--vp-c-text-2);
  --cc-btn-primary-bg: var(--vp-c-brand-1);
  --cc-btn-primary-hover-bg: var(--vp-c-brand-2);
  --cc-btn-primary-border-color: var(--vp-c-brand-1);
  --cc-btn-primary-hover-border-color: var(--vp-c-brand-2);
  --cc-btn-secondary-bg: var(--vp-c-default-soft);
  --cc-btn-secondary-color: var(--vp-c-text-1);
  --cc-btn-secondary-border-color: var(--vp-c-divider);
  --cc-btn-secondary-hover-bg: var(--vp-c-default-3);
  --cc-btn-secondary-hover-color: var(--vp-c-text-1);
  --cc-cookie-category-block-bg: var(--vp-c-bg-soft);
  --cc-cookie-category-block-hover-bg: var(--vp-c-bg-alt);
  --cc-cookie-category-block-border: var(--vp-c-divider);
  --cc-separator-border-color: var(--vp-c-divider);
  --cc-footer-bg: var(--vp-c-bg-soft);
  --cc-footer-border-color: var(--vp-c-divider);
  --cc-modal-border-radius: 12px;
  --cc-btn-border-radius: 8px;
}
.docs-privacy-control {
  display: block;
  margin: 24px auto;
  padding: 8px 16px;
  font-size: 13px;
  color: var(--vp-c-text-2);
  text-decoration: underline;
  text-underline-offset: 3px;
}
.docs-privacy-control:hover { color: var(--vp-c-brand-1); }
.docs-privacy-control:focus-visible { outline: 2px solid var(--vp-c-brand-1); outline-offset: 4px; }
</style>
