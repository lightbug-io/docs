# PR previews

`Preview build` runs PR code on a disposable GitHub-hosted runner with a read-only
contents token, no secrets and no shared cache. `Publish previews` executes only
trusted default-branch code and parses bounded static ZIPs; it never executes PR
code. Existing next/production S3 and CloudFront workflows are unchanged.

Publication is off until an administrator completes this setup:

- Review/merge these files, then enable GitHub Pages **GitHub Actions** publishing
  for this repository. Use a dedicated preview hostname, preferably on a separate
  registrable domain from production. Configure DNS/HTTPS separately; do not
  redirect the live documentation hostname here.
- Protect `github-pages` so only `main` may deploy. Review changes to these
  workflows/scripts as security-sensitive. Keep fork workflow write tokens and
  secrets disabled, do not expose privileged/self-hosted runners to PRs, and require GitHub's approval for untrusted fork workflow runs.
  No PAT, cloud credentials or additional persistent access is needed.
- Verify the repository's `GITHUB_TOKEN` can read collaborator permissions. A 403
  fails closed; do not add a broader credential to bypass it.
- Set `PREVIEW_PATH_PREFIX` to `/docs` for the default project Pages URL, or `/`
  for a custom hostname.
  Set `PREVIEWS_ENABLED=true` only after the above checks. Run **Publish previews**
  on `main` to reconcile. This PR does not configure or enable any of these.

The VitePress base defaults to `/` outside previews. Preview URLs are
`<Pages URL>/pr/<number>/<40-character-head-SHA>/`; the publisher summary lists
paths. There is deliberately no mutable `pr/<number>/` alias. For a custom
hostname set `PREVIEW_PATH_PREFIX` to `/`; the build normalizes the trailing slash.
Rebuild open PRs after changing the prefix. Review hard-coded root-relative links
in content when using a project Pages path; VitePress cannot rewrite arbitrary
application strings.

Automatic publication requires a same-repository PR and current repository
write/maintain/admin permission for its author, original run actor and rerun
actor. `CONTRIBUTOR` association is never sufficient. Forks and other untrusted
PRs require a non-author maintainer with verified write access to submit an
**Approve** review on the exact current commit, with only this body:

```
Publish preview: <full current head SHA>
```

Then run **Publish previews** on `main`, or wait for the hourly reconciliation.
Approval applies only to that SHA, is rechecked on every publication, and is
invalidated by a later changes-requested/dismissed review from that reviewer.
An ordinary code approval does not authorize preview publication. If GitHub omits
fork PR provenance from the build run, publication is refused; do not bypass it.

Each reconciliation constructs a fresh site from successful, unexpired artifacts
for open non-draft PRs. Closing/updating a PR or converting it to draft triggers
metadata-only cleanup; hourly reconciliation also removes closed, stale,
revoked and expired entries. Artifacts expire after seven days: rerun the build
for a fresh preview. Limits: 20 previews, 50 MiB compressed/100 MiB expanded per
preview, 20 MiB per file, 10,000 entries and 300 MiB total. API/validation failures
attempt an inert replacement of the entire preview site, so one bad preview
cannot intentionally preserve other stale previews.

Pages deployment is not transactional with GitHub PR state. Publications are
serialized, validate immediately before and after deployment, and attempt an
immediate empty-site replacement if checks fail. A change during deployment can
briefly leave an old immutable URL accessible; outages, job cancellation/timeouts,
GitHub scheduling delays and browser/CDN caches can prolong removal. If that
residual exposure is unacceptable, leave previews disabled. This is public
content, not an access-controlled review system.

All PR directories share an origin: preview HTML/JavaScript is hostile even after
archive validation. Never use real login sessions, API tokens, customer data or
production cookies on this site. A dedicated hostname does not isolate PRs from
one another, including service workers. Do not use preview browser state as trust.

Run boundary tests with
`python3 -m unittest discover -s .github/preview -p 'test_*.py'`.
See GitHub's [secure workflow guidance](https://docs.github.com/en/actions/reference/security/secure-use)
and [Pages workflow setup](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).
