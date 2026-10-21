# API reference layout

The versioned operation pages use `ApiReference.vue`. Navigation, method labels,
request generation, schema rendering, response status/content selectors, JSON
views, copy buttons, authentication, and requests remain owned by
`vitepress-openapi` (the existing lockfile resolves version 0.1.12).

The wrapper uses the public `useOpenapi` parser to resolve responses, suppresses
the original response slot, then mounts the native `OAResponses` component in
the playground slot. Native code samples keep their original DOM and keyboard order after it. The
native playground remains in an initially open, keyboard-operable disclosure.
No responses, methods, navigation entries, or code samples are fabricated here.

CSS is scoped to the `api-reference-page` page class and `api-reference` wrapper.
The CSS selectors for `OAPathContentEnd` children and the response header reflect
version 0.1.12's markup. Revisit them if the renderer is upgraded. Narrow pages
collapse to one column; dark mode and visible keyboard focus are retained.

## Review checklist

- View a version 1 and version 2 operation; navigate between operations and back.
- Compare GET and non-GET paths and an operation with a request body.
- Switch response status, content type, JSON/schema, and sample language.
- Exercise copy buttons and expand/collapse the playground.
- On a local test fixture, intercept the request before testing submission. Do
  not use real API credentials or mutate real devices from a public preview.
- Check widths of 390px, 768px, and 1440px, and light/dark mode.

This is a presentation-only change. Response preservation and unsupported-route
filtering belong to the separate loader fix; this layout does not repair missing
responses in the input specification.
