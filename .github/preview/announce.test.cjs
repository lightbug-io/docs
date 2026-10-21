const { test } = require('node:test');
const assert = require('node:assert/strict');
const { announce } = require('./announce.cjs');

function fixture() {
  const sha = 'a'.repeat(40), pagesSha = 'b'.repeat(40);
  const expected = { pr: '14', sha, artifact: '9', environment: 'preview-internal' };
  const pr = { number: 14, state: 'open', base: { ref: 'main', repo: { full_name: 'lightbug-io/docs' } },
    head: { sha, repo: { id: 1 } } };
  const run = { id: 7, event: 'pull_request', status: 'completed', conclusion: 'success',
    repository: { id: 1, full_name: 'lightbug-io/docs' }, workflow_id: 8,
    path: '.github/workflows/preview-build.yml', run_attempt: 2, head_sha: sha,
    head_repository: { id: 1 }, pull_requests: [{ number: 14 }] };
  const artifact = { id: 9, name: `preview-static-${sha}-2`, expired: false, size_in_bytes: 10,
    workflow_run: { id: 7, head_sha: sha, head_repository_id: 1 } };
  const calls = [], comments = [], builds = [{ id: 10, head_sha: pagesSha, status: 'completed', conclusion: 'success', path: 'dynamic/pages/pages-build-deployment' }];
  let requested = false;
  const github = { rest: {
    git: { getRef: async () => ({ data: { object: { sha: pagesSha } } }) },
    repos: { requestPagesBuild: async () => { requested = true; calls.push('request'); } },
    actions: { listWorkflowRunsForRepo: async params => {
      assert.equal(params.head_sha, pagesSha);
      const build = requested ? (builds.length > 1 ? builds.shift() : builds[0]) :
        { id: 1, path: 'dynamic/pages/pages-build-deployment', status: 'completed', conclusion: 'failure' };
      return { data: { workflow_runs: [build].filter(b => !b.head_sha || b.head_sha === params.head_sha) } };
    }, getWorkflowRun: async () => ({ data: run }),
      getWorkflow: async () => ({ data: { id: 8 } }), listWorkflowRunArtifacts: 'artifacts' },
    pulls: { get: async () => ({ data: pr }) },
    issues: { listComments: 'comments',
      createComment: async data => calls.push({ create: data }),
      updateComment: async data => calls.push({ update: data }) },
  }, paginate: async method => method === 'artifacts' ? [artifact] : comments };
  const summary = { addLink: () => summary, addRaw: () => summary, write: async () => calls.push('summary') };
  const args = { github, expected, sleep: async () => calls.push('sleep'),
    core: { setOutput() {}, summary }, context: { repo: { owner: 'lightbug-io', repo: 'docs' },
      serverUrl: 'https://github.com', runId: 123, payload: { workflow_run: { id: 7, run_attempt: 2 } } } };
  return { args, calls, comments, builds, pr, pagesSha };
}

test('publishes one linked comment only after matching Pages build completes', async () => {
  const f = fixture();
  f.builds.unshift({ head_sha: 'c'.repeat(40), status: 'completed' },
    { id: 1, head_sha: f.pagesSha, path: 'dynamic/pages/pages-build-deployment', status: 'completed', conclusion: 'failure' },
    { id: 10, head_sha: f.pagesSha, path: 'dynamic/pages/pages-build-deployment', status: 'in_progress' });
  await announce(f.args);
  assert.equal(f.calls.filter(c => c === 'sleep').length, 3);
  const comment = f.calls.find(c => c.create).create;
  assert.equal(comment.issue_number, 14);
  assert.match(comment.body, /\[Open preview\]\(https:\/\/lightbug-io.github.io\/docs\/pr\/14\/\)/);
  assert.match(comment.body, /actions\/runs\/123/);
  assert.match(comment.body, new RegExp(f.args.expected.sha));
  assert.equal(f.calls.at(-1), 'summary');
});

test('updates the existing bot comment, ignoring lookalike user comments', async () => {
  const f = fixture();
  f.comments.push({ id: 1, body: '<!-- docs-pr-preview -->', user: { login: 'someone', type: 'User' } },
    { id: 2, body: '<!-- docs-pr-preview -->\nold', user: { login: 'github-actions[bot]', type: 'Bot' } });
  await announce(f.args);
  assert.equal(f.calls.find(c => c.update).update.comment_id, 2);
  assert.ok(!f.calls.some(c => c.create));
});

for (const [name, change, error] of [
  ['Pages failure', f => f.builds[0].conclusion = 'failure', /Pages deployment failed/],
  ['Pages timeout', f => f.builds[0].status = 'in_progress', /eight minutes/],
  ['unrelated successful Pages commit', f => f.builds[0].head_sha = 'c'.repeat(40), /eight minutes/],
  ['unrelated workflow', f => f.builds[0].path = '.github/workflows/other.yml', /eight minutes/],
  ['cancelled deployment', f => f.builds[0].conclusion = 'cancelled', /Pages deployment failed/],
  ['superseded PR head', f => f.pr.head.sha = 'd'.repeat(40), /exact build commit/],
  ['closed PR', f => f.pr.state = 'closed', /exact build commit/],
]) test(`${name} does not announce success or touch a comment`, async () => {
  const f = fixture(); change(f);
  await assert.rejects(announce(f.args), error);
  assert.ok(!f.calls.some(c => typeof c === 'object' || c === 'summary'));
});
