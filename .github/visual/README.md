# Visual documentation comparisons

Review how two committed revisions render without maintaining golden screenshots.
This is a report-only review aid, not a merge gate or proof that content is correct.
The same command runs locally and in a manually requested GitHub Action.

## Local use

Use Node **22.23.4** (the repository's `.nvmrc`) and Git. Install the small,
independently locked tooling package and its pinned Chromium:

```sh
npm ci --prefix .github/visual
npm exec --prefix .github/visual -- playwright install chromium
# On Linux, install browser OS dependencies if needed:
# npm exec --prefix .github/visual -- playwright install --with-deps chromium

git fetch origin main
npm run visual:diff -- --base origin/main --head HEAD
```

The command resolves immutable SHAs, compares the merge base with `HEAD`, creates
two temporary detached worktrees, initializes their submodules, runs `npm ci` and
`npm run build` sequentially, and captures both builds in one browser environment.
It does not switch or edit your working branch. Uncommitted changes are not included.
Temporary worktrees are removed on normal completion/failure; interruption may
leave a path under the system temporary directory, visible in `git worktree list`.

**Only run trusted commits locally.** Dependency installation and VitePress builds
execute code from both revisions. Temporary worktrees and environment filtering
are not a security sandbox. Use the isolated read-only CI runner for untrusted PRs.

Open `visual-report/index.html` in a browser. Keep the whole report directory,
including `images/`, together. The gallery uses no JavaScript or remote resources.
Click images for full-size inspection. `summary.json` records SHAs, route scope,
browser version, per-capture errors, dimensions and pixel counts. Existing output
directories are never overwritten; choose a new output path for a subsequent run.

```sh
# A smaller run; a trailing slash selects a route prefix, otherwise exact route.
npm run visual:diff -- --routes /guides/,/devices --output visual-guides
# Narrow mobile viewport with its menu/sidebar states, in dark mode.
npm run visual:diff -- --profiles mobile --color dark --output visual-dark
# Compare the actual base tip instead of the merge base.
npm run visual:diff -- --comparison base-tip --output visual-base-tip
# Compare a fetched PR commit, without depending on its moving preview URL.
git fetch origin refs/pull/40/head
npm run visual:diff -- --base origin/main --head FETCH_HEAD --output visual-pr40
```

Full builds can consume substantial memory. Builds are sequential, but a machine
that cannot build the docs once will still need CI. Narrowing `--routes` reduces
browser work, **not** the build scope. No production/preview deployment is required.
The tool uses `DEPLOYMENT_NAME=Preview` and `/docs/visual/` on both sides to exercise
nested base paths rather than hide root-relative resource problems.

## Coverage and interpretation

- Routes come from the union of both built HTML trees, including generated API
  routes and directory indexes. The generic 404 file is excluded. Renames appear
  as a removed route and an added route; they are not guessed or paired.
- By default all rendered routes are captured. This includes unchanged source
  pages affected by sidebar/config, components, shared includes, YAML and assets.
  A filtered run is explicitly partial and must not be described as full coverage.
- Desktop is 1440×1000, mobile 390×844, device scale 1. Mobile captures the page,
  top navigation and device sidebar where those controls exist. Normal captures
  do not exercise every tab, accordion, search flow, interaction or download.
- Before/after/diff images use the same browser, fonts, viewport, locale, timezone,
  color scheme and reduced motion. Fonts/images are awaited, lazy images loaded,
  and two consecutive screenshots must stabilize. Pages over 30,000 CSS pixels
  are rejected rather than silently truncated.
- Public images/fonts from `upload.r2.lb.chasm.cloud`, `docs.lightbug.io`,
  `lightbug.io` and `upload.wikimedia.org` are fetched once per URL and reused for
  both sides of the run. Redirects must stay within that list. Other external
  requests, including analytics/API requests/frames, are blocked. This is a static
  documentation review, not a live-service integration test. Failed/missing
  images or local resources are reported as capture errors, never masked away.
- Pixelmatch's per-pixel color tolerance is 0.2. The report shows raw changed-pixel
  counts/ratios and dimension changes; there is no percentage pass threshold.
  Text insertions can shift the whole page. A small ratio does not prove quality.
- Exit **0** means capture completed, even when pages differ or are added/removed.
  Build/capture/resource failures exit **1** and leave an error/partial report.
  Reports written during a run are marked **INCOMPLETE** until the run finishes.
- Native Mac/Windows/Linux screenshots can differ. Both sides of each local run
  are captured together; CI results are canonical Ubuntu/Chromium comparisons.
  For diagnosis only, `VISUAL_CHROMIUM_PATH` can select an already-installed
  browser. Its version is recorded; it is not the pinned CI environment.

## Manual GitHub Action

After this workflow has been reviewed and merged into **main**, maintainers can
run **Visual diff report**, choose **main**, and enter an open PR number targeting
main. Optional route and viewport inputs control screenshot scope. Default is all
rendered routes and both viewports. The workflow must be on the default branch
before GitHub exposes manual dispatch; this is not enabled by an unmerged draft.

```sh
gh workflow run visual-diff.yml --ref main -f pr=40 -f profiles=both
# Optional -f routes='/devices/,/guides/'
```

The resolve job records the exact head and merge-base SHA. The capture job builds
those revisions without secrets or write permissions, on a fresh hosted runner,
with no persisted checkout credentials or shared dependency cache. Forks are
supported because a maintainer explicitly chooses the PR; never put its build in
`pull_request_target` or in the comment job.

A separate fresh-runner job uses only trusted main-branch code, validates GitHub
run/attempt/artifact metadata, rechecks the PR head, and updates one bot-owned
comment. It does **not** download, import or execute report contents. The artifact's
workflow SHA is the dispatch commit on main, not the compared PR head. Stale
results are not announced as the current PR result. Same-head concurrent runs may
replace the comment in completion order; every comment identifies its run/SHAs.

The comment links the run and a **downloadable artifact**, not a hosted website.
GitHub sign-in and repository read access are required. Artifacts expire after
**7 days**. Download, unzip, and open `index.html`. Upload/capture failures receive
a status link, not a false report-ready announcement. A workflow cancellation or
timeout can leave a partial artifact or prevent upload/comment entirely.

This repository is public. Reports, screenshots and logs must contain only
public-safe documentation, never credentials, customer data or private review
material. The report is PR-controlled output despite its generated static gallery;
do not treat downloaded files as trusted software. Nothing is deployed to Pages,
production or docs-next, and no paid visual-testing service is involved.

## Development and checks

```sh
npm ci --prefix .github/visual
npm run test:visual
node --test .github/preview/*.test.cjs
npm test -- --runInBand
actionlint .github/workflows/visual-diff.yml .github/workflows/visual-tooling-tests.yml
npm exec --prefix .github/visual -- playwright install --with-deps chromium
node .github/visual/smoke.mjs
```

The separate read-only **Visual tooling tests** workflow runs synthetic browser
fixtures when this tool changes. It verifies paired/added/removed/unchanged pages,
mobile menus, report-only exits, capture failures and overwrite protection. It
never runs a full documentation comparison or posts a PR comment. This lets a
draft PR validate Chromium capture before the manual workflow lands on main.

CI and debugging can supply already isolated checkouts with `--base-dir` and
`--head-dir`, plus their full `--base-sha` and `--head-sha`. For prebuilt test fixtures
only, add `--skip-build`; the outputs must have the `/docs/visual/` base. This mode
does not verify that generated output matches those SHAs and is not used by the
manual reporting workflow.
