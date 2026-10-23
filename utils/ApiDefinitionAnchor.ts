/// <reference lib="dom" />

/** Reveal the SSR-rendered definition after direct links or router navigation. */
export function revealApiDefinition() {
    if (typeof window === 'undefined' || window.location.hash !== '#openapi-definition') return
    const details = document.querySelectorAll<HTMLDetailsElement>('.api-definition details')
    if (!details.length) return
    details.forEach(fold => { fold.open = true })
    document.getElementById('openapi-definition')?.scrollIntoView()
}
