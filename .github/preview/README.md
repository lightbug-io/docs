# PR previews

PRs targeting `main` use `https://lightbug-io.github.io/docs/pr/<number>/`.
The pinned [JamesIves action](https://github.com/JamesIves/github-pages-deploy-action/tree/fa24774553152dd7873cd16ebd8d959b010c5445)
updates one PR folder on `gh-pages`; closing the PR cleans that folder.

A single **Documentation preview** comment on the PR links to the last successfully
published preview and its publishing workflow. It records the exact PR commit;
a green **Preview build** alone only means the artifact is ready, not that Pages
has published it. The publisher waits for the Pages build-and-deployment workflow to succeed for the matching
`gh-pages` commit, then rechecks the PR head before adding/updating the comment. Failed,
timed-out or superseded publications do not announce a new preview.

The comment automation takes effect once these workflow changes are merged into
`main`; rerun **Preview build** for existing PRs after merging.

## One-time administrator setup

Publication stays off until all of these are done:

1. Review and merge the workflows. Create `gh-pages` with an empty `.nojekyll`
   file at its root, then select **Settings → Pages → Deploy from a branch →
   gh-pages / (root)**. Leave the custom-domain field empty.
2. Create `preview-internal` and `preview-external` environments, allowing only
   `main`. Require maintainer reviewers and prevent self-review on
   `preview-external`; same-repository branches use `preview-internal` without
   approval. Allow `gh-pages` in GitHub's `github-pages` environment for automatic
   branch deployment/cleanup. Keep fork write tokens/secrets disabled and require
   approval for untrusted fork workflow runs.
3. Set repository variable `PREVIEWS_ENABLED=true`. Re-run a PR's **Preview build**
   to publish it. For forks, approve the **Approve PR … at …** environment request
   only after reviewing the displayed commit. No custom review comment or
   approval script is involved.

The two preview environments select approval/branch rules, not separate hosting,
runners or token permissions. Both publish into the same Pages site. The internal
name lets one approval job select its gate without duplicating the workflow.
Approval waits do not hold the shared publish/cleanup lock.

The build checks out the exact PR commit with a read-only token, no secrets and
no shared cache. The publisher runs only trusted default-branch code: it binds
GitHub's run/artifact metadata to the current PR commit and rechecks after
approval. The pinned download action extracts into a separate temporary folder;
small checks reject filesystem links, hidden/control files and oversized output. PR files
are never executed by the publisher. A Pages build is explicitly requested after
branch updates because `GITHUB_TOKEN` pushes do not themselves trigger one.

Each approved update replaces `/pr/<number>/`; the previous preview stays until
then. Builds expire after seven days; rerun the build if approval takes longer.
If publishing or cleanup fails, rerun that workflow. The shared publish queue
retains up to 100 pending jobs. Removal is asynchronous, not instant revocation,
and CDN/browser caches may retain content. All previews are public and share the
`lightbug-io.github.io` origin with other project Pages sites. Do not use real
credentials, customer data or trusted browser sessions there.

## Checks

- `node --test .github/preview/*.test.cjs`
- `npm test -- --runInBand`
- `DEPLOYMENT_NAME=Preview PREVIEW_BASE=/docs/pr/13/ npm run build`
- Run `actionlint` on both preview workflows. Older versions do not recognize
  GitHub's documented [`queue: max`](https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/control-workflow-concurrency#example-queueing-multiple-pending-runs).

VitePress defaults to `/` for normal builds. Hard-coded root-relative content
links may need updating separately for the project Pages path.
