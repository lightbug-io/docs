<template>
  <div class="toit-code-example">
    <div class="code-block">
      <slot></slot>
    </div>
    <div class="source-link">
      <a :href="githubUrl" target="_blank" rel="noopener noreferrer">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
        {{ displayText }}
      </a>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  // The relative path to the file in the toit-lightbug repo
  // e.g., "examples/messages/m35_device_ids.toit"
  path: {
    type: String,
    required: true
  },
  // Optional custom display text, defaults to showing the GitHub URL
  text: {
    type: String,
    default: null
  },
  // Optional branch name, defaults to "main"
  branch: {
    type: String,
    default: 'main'
  }
})

const githubUrl = computed(() => {
  return `https://github.com/lightbug-io/toit-lightbug/blob/${props.branch}/${props.path}`
})

const displayText = computed(() => {
  if (props.text) return props.text
  // Extract org/repo#path format from GitHub URL
  // URL format: https://github.com/lightbug-io/toit-lightbug/blob/main/examples/messages/m35_device_ids.toit
  const urlParts = githubUrl.value.split('/')
  const org = urlParts[3] // lightbug-io
  const repo = urlParts[4] // toit-lightbug
  const path = urlParts.slice(7).join('/') // examples/messages/m35_device_ids.toit
  return `${path} in ${org}/${repo} `
})
</script>

<style scoped>
.toit-code-example {
  margin: 1rem 0;
}

.code-block {
  margin-bottom: 0.5rem;
}

.source-link {
  margin-top: 0.5rem;
  font-size: 0.875rem;
}

.source-link a {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  color: var(--vp-c-text-2);
  text-decoration: none;
  transition: color 0.2s;
}

.source-link a:hover {
  color: var(--vp-c-brand-1);
}

.source-link svg {
  flex-shrink: 0;
}
</style>
