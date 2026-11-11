# Lightbug docs

Code powering https://docs.lightbug.io making use of vitepress

## Development

Install dependencies

```bash
npm install
```

Run the development server

```bash
npm run dev
```

Or build and serve the static site

```bash
npm run build
npm run preview
```

## Deployments

Merges to the `main` branch will auto deploy onto https://docs-next.lightbug.io

The `production` branch will deploy to the main site at https://docs.lightbug.io

### Reproducing CI builds locally

The site build uses an environment variable `DEPLOYMENT_NAME` to alter some config (for example `sitemap` and `editLink`). CI sets this during the build step. To reproduce CI builds locally you can use the included npm scripts:

- `npm run build:next` — sets `DEPLOYMENT_NAME=Next` (matches `main` branch/next site)
- `npm run build:production` — sets `DEPLOYMENT_NAME=Production` (matches `production` branch/main site)

Both scripts use `cross-env` so they work cross-platform.

PR preview workflows and administrator setup: [.github/preview](https://github.com/lightbug-io/docs/blob/main/.github/preview/README.md).

## Protocol sentinel values

Numeric field definitions in `public/files/protocol-v3.yaml` can declare raw
sentinel values separately from ordinary enum `values`. For example:

```yaml
type: int16
conversion: 100
unit: C
sentinels:
  -32768:
    id: unavailable
    name: Unavailable
    description: No temperature was available at the resistance measurement.
```

Keys are decoded raw numeric values, before conversion. Each entry has a stable
`id`, a display `name`, and an optional `description`. A matching value displays
`Unavailable (raw -32768)` without conversion or physical units. Other values
retain normal parsing and formatting. The wire type and bytes are unchanged;
an omitted field remains different from a present field carrying a sentinel.
Only fields that explicitly declare a sentinel use this behavior. It applies to
scalar numeric fields, not strings or individual elements of arrays.

The annotated message parser and captured-example summaries share the same
lookup. Both structured and legacy field references list the declared sentinel
values from the spec.

The upstream YAML exporter lives in `lightbug-io/gingin`, outside this repository.
Its typed `MessageData` schema needs a corresponding `sentinels` property and
round-trip coverage before regeneration can preserve this metadata. Until that
follow-up is made, do not overwrite the docs spec with an upstream export without
retaining these declarations. The docs site itself reads the YAML directly.
