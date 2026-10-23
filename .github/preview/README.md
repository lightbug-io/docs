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

## Branch previews (no PR required)

After these workflows land on `main`, use **Actions → Branch preview build →
Run workflow** and select a same-repository feature branch. That branch must
contain the exact current `branch-preview-build.yml` from `main`; update/rebase
older branches first. Alternatively, include the literal `[ci-preview]` in the
**head commit message** of a branch push. Earlier commits in a multi-commit push
are not inspected. Ordinary pushes do not build. Tags, forks, `main`,
`production` and `gh-pages` are excluded. The workflow cannot be manually
activated while it exists only on an unmerged feature branch.

The source commit is immutable for the build, and publication rechecks that the
branch still points to it. The publisher verifies repository and workflow
identity, the exact trusted build-workflow file, original and rerun actors'
current write access, the push opt-in, and the exact run/attempt/artifact. Direct
push permission is not a substitute for these checks. Branch-controlled code
runs only in the read-only build, without secrets, saved credentials or shared
cache. The privileged publisher executes only default-branch helpers and treats
the artifact as static files. These checks do not replace GitHub's repository
permissions or environment protection rules.

A successful **Publish branch previews** summary links to
`https://lightbug-io.github.io/docs/branch/<sha256-of-full-branch-ref>/` only after
Pages has published the matching `gh-pages` commit. Each branch has one stable
URL; a successful new publication replaces it and renews its timestamp. Stale
runs cannot overwrite a newer publication. Branch names never become filesystem
paths or shell commands. This uses the existing `PREVIEWS_ENABLED` switch and
`preview-internal` environment. It does not deploy to Next or Production.

To remove a previous branch preview, run **Publish branch previews** manually
**on main**, filling in `cleanup_branch` with its original branch name. The
source branch may already have been deleted: only managed preview files are
removed, never source branches. Unknown branches fail safely. A replay of an
old cleanup request cannot remove a newer publication. Builds started before a
manual removal cannot resurrect the removed preview; start a new build instead.

Every workflow job that writes our Pages site (PR publication, PR-close cleanup,
branch publication and manual branch cleanup) first removes managed branch
previews **older than 30 days**. This defines “one month” as 30 × 24 hours in UTC,
not a calendar-month boundary. Cleanup is opportunistic on the next Pages write,
not a scheduled promise of exact expiry. The S3/CloudFront Next and Production
workflows are not Pages writers and are unchanged. PR previews and unrelated or
unmanaged Pages files are never age-deleted.

The trusted publisher owns `.branch-previews.json` on `gh-pages`, separate from
build artifacts. Its publication timestamp, not filesystem mtime or source
commit date, determines age. All writers use the existing shared queue/lock and
read the latest Pages state inside it. Cleanup and publication are **separate
commits** when both change state; no empty cleanup commit is made. Branch
publication sends one Git pack using only objects/index operations, never a
checkout of Pages files or execution of artifact scripts. Ref updates
are non-forced and fail rather than overwrite a concurrent external change.
The queue retains up to 100 pending jobs; rerun a cancelled/failed request when
needed. Removal remains subject to Pages deployment and browser/CDN caching.
