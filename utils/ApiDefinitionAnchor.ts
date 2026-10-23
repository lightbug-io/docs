/// <reference lib="dom" />

/** Reveal the SSR-rendered definition after direct links or router navigation. */
export function revealApiDefinition() {
    if (typeof window === 'undefined' || window.location.hash !== '#openapi-definition') return
    const details = document.querySelector<HTMLDetailsElement>('.api-definition details')
    if (!details) return
    details.open = true
    document.getElementById('openapi-definition')?.scrollIntoView()
}
