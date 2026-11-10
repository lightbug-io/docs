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

## Capability documentation

`data/device-capabilities.json` is the single documentation registry for capability groups, links and known device relationships. It is deliberately partial, not a complete hardware support matrix. A missing relationship means “not documented here”, not “unsupported”. Product specification YAML remains separate; do not infer model support from family names or automatically copy a specification across generations.

- Add a capability and its group to the registry. The catalogue and grouped sidebar are generated from it.
- Add each verified device relationship once, with revision caveats and an optional device-specific detail link. `DeviceCapabilities` renders a device's related guides; `CapabilityDevices` renders a compact reverse list of current documented models. The registry’s `listing` field follows the site’s current/legacy navigation; it is not an availability or manufacturing claim. Legacy relationships remain available for their device pages.
- Keep detailed behaviours on the capability or device page, not in the registry. Add only verified mappings: the existing BLE guide is listed, but its product coverage has not yet been enumerated here.
- `LedDemo` provides keyboard-accessible examples. Battery and charging patterns animate when a matching level is selected, while respecting reduced-motion preferences. Its pure display logic is tested separately from the prose; keep both aligned when thresholds or timing change. Examples are illustrative, not a connection to real hardware.

Run `npm test -- --runInBand` and `npm run build` after changing the registry, components or documentation. Tests check registry integrity, routes and the intended model boundaries.
