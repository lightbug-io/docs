const assert = require('node:assert/strict');
const { setTimeout } = require('node:timers/promises');
const marker = '<!-- docs-pr-preview -->';

// Runs only in the trusted publisher, while it holds the publish/cleanup lock.
async function announce({ github, context, core, expected, sleep = setTimeout }) {
  const repo = context.repo;
  const { data: ref } = await github.rest.git.getRef({ ...repo, ref: 'heads/gh-pages' });
  const commit = ref.object.sha;
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
  // A newer push or PR closure during Pages publication must not get a ready comment.
  await require('./check.cjs').check({ github, context, core, expected });
  const url = `https://lightbug-io.github.io/docs/pr/${expected.pr}/`;
  const run = `${context.serverUrl}/${repo.owner}/${repo.repo}/actions/runs/${context.runId}`;
  const body = `${marker}\n### Documentation preview\n\n[Open preview](${url})\n\n` +
    `Last published commit: ${expected.sha}\n\n[Publish workflow](${run})\n\n` +
    'This URL updates after each successful publication. A newer commit may still be building or awaiting approval. The preview is removed when this PR closes.';
  const comments = await github.paginate(github.rest.issues.listComments,
    { ...repo, issue_number: Number(expected.pr), per_page: 100 });
  const previous = comments.find(comment => comment.user?.login === 'github-actions[bot]'
    && comment.user?.type === 'Bot' && comment.body?.startsWith(marker));
  if (previous) {
    await github.rest.issues.updateComment({ ...repo, comment_id: previous.id, body });
  } else {
    await github.rest.issues.createComment({ ...repo, issue_number: Number(expected.pr), body });
  }
  await core.summary.addLink('Open PR preview', url).addRaw(`\n\nPublished commit: ${expected.sha}`).write();
}
module.exports = { announce };
