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

## Protocol

The docs site reads `public/files/protocol-v3.yaml` as its public schema input.
This file is copied in from the protocol source for documentation; protocol
authoring and schema maintenance do not happen in this repository.
