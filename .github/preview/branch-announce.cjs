'use strict';
const assert = require('node:assert/strict');
const { setTimeout } = require('node:timers/promises');
async function waitForPages({ github, context, commit, sleep = setTimeout }) {
  const repo = context.repo;
  const { data: ref } = await github.rest.git.getRef({ ...repo, ref: 'heads/gh-pages' });
  assert(ref.object.sha === commit, 'Pages branch changed before publication');
  assert(/^[0-9a-f]{40}$/.test(commit), 'Missing Pages commit');
  const pagesRuns = async () => {
    const { data } = await github.rest.actions.listWorkflowRunsForRepo({
      ...repo, head_sha: commit, event: 'dynamic', per_page: 100,
    });
    return data.workflow_runs.filter(run => run.path === 'dynamic/pages/pages-build-deployment');
  };
  // Ignore a previous failed attempt for unchanged output when retrying publication.
  const previousRuns = new Set((await pagesRuns()).map(run => run.id));
  await github.rest.repos.requestPagesBuild(repo);
  let published = false;
  for (let attempt = 0; attempt < 48; attempt++) {
    const runs = (await pagesRuns()).filter(run => !previousRuns.has(run.id));
    const deployment = runs.sort((a, b) => b.id - a.id)[0];
    // GitHub may cancel a redundant automatic Pages run when the request queues another.
    if (deployment?.status === 'completed' && deployment.conclusion !== 'cancelled') {
      assert(deployment.conclusion === 'success', 'Pages deployment failed; no preview announced');
      published = true;
      break;
    }
    await sleep(10000);
  }
  assert(published, 'Pages did not finish within eight minutes; rerun the publisher');
  const { data: latest } = await github.rest.git.getRef({ ...repo, ref: 'heads/gh-pages' });
  assert(latest.object.sha === commit, 'Pages branch changed during publication');
}
async function announce({ github, context, core, expected, commit, sleep }) {
  await waitForPages({ github, context, commit, sleep });
  await require('./branch.cjs').check({ github, context, core, expected });
  const url = `https://lightbug-io.github.io/docs/branch/${expected.id}/`;
  await core.summary.addLink('Open branch preview', url)
    .addRaw(`\n\nPublished source commit: ${expected.sha}\n\nAutomatically eligible for cleanup after 30 days, on the next Pages publication.`).write();
}
module.exports = { waitForPages, announce };
