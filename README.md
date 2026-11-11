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

## Protocol YAML authoring and export

`public/files/protocol-v3.yaml` is the canonical source. It uses native YAML
anchors (`&name`), aliases (`*name`) and merge keys (`<<: *name`), parsed by the
same `js-yaml` dependency used by the docs. There is no separate template engine.
Consumers without merge-key support can use the expanded export below.

- Definitions used only within one message are anchored at their first use in
  that message. Use message-specific anchor names: anchors have document scope,
  not message scope, and must appear before their aliases.
- Only header maps shared across messages live in the top-level
  `templates.headers` registry: `optionalOkReply`, `correlatedOkAck`, and
  `optionalCorrelationAck`. An anchor has no effect unless explicitly aliased
  or merged into an actual message definition.
- A YAML merge is shallow. An explicit key replaces that entire merged value;
  replacing a header entry does not inherit the entry's other properties.
  Anchor smaller maps when individual nested values need to be reused.

### Navigate shared definitions

In VS Code with [Red Hat YAML](https://github.com/redhat-developer/vscode-yaml),
put the caret on an alias (`*name`) and run **Go to Definition** from the context
menu. The extension's language server
[resolves aliases to their anchors](https://github.com/redhat-developer/yaml-language-server/blob/main/src/languageservice/services/yamlDefinition.ts).
This follows the explicit alias, not an inherited field name or arbitrary string.

[IntelliJ IDEA's YAML support](https://www.jetbrains.com/help/idea/yaml.html)
documents alias-to-anchor navigation, anchor usages, and anchor/alias rename.
Use **Go to Declaration or Usages**; the shortcut depends on your key bindings.
These are editor features, not something the docs site adds. If your editor or
extension version lacks them, search for `&name` in the canonical file. The
expanded download below is useful for inspecting all values without jumping.

### Export expanded YAML

The protocol overview offers **Download expanded YAML** at
`files/protocol-v3-expanded.yaml`, including on PR previews. The build creates it
from the canonical source; the development server generates it on each request.
Do not commit or edit a second generated specification.

To inspect or save the same output locally after installing dependencies:

```bash
npm run --silent export:protocol
npm run --silent export:protocol > /tmp/protocol-v3-expanded.yaml
```

The export resolves aliases and merge keys using the `yaml` library's typed
maps, keeping numeric keys as integers and deliberately quoted keys as strings
for SDK generator compatibility. It emits no anchors and removes only
the top-level authoring-only `templates` registry. All other parsed data is
preserved, including sentinels and version overrides. It does not invent runtime
defaults or flatten message-version description inheritance. Comments and
source formatting are not retained. Edit the canonical source and re-export.

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
