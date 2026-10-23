'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { waitForPages } = require('./branch-announce.cjs');
function fixture() {
  const commit = 'a'.repeat(40);
  const state = { ref: commit, requested: 0, conclusion: 'success', publishedSha: commit, moveAfter: false };
  const github = { rest: {
    git: { getRef: async () => ({ data: { object: { sha: state.ref } } }) },
    repos: { requestPagesBuild: async () => { state.requested++; } },
    actions: { listWorkflowRunsForRepo: async ({ head_sha }) => {
      assert.equal(head_sha, commit);
      if (!state.requested || state.publishedSha !== commit) return { data: { workflow_runs: [] } };
      if (state.moveAfter) state.ref = 'b'.repeat(40);
      return { data: { workflow_runs: [{ id: 5, path: 'dynamic/pages/pages-build-deployment', status: 'completed', conclusion: state.conclusion }] } };
    } },
  } };
  return { state, args: { github, context: { repo: { owner: 'lightbug-io', repo: 'docs' } }, commit, sleep: async () => {} } };
}
test('branch URL readiness binds exact returned publication commit', async () => {
  const f = fixture(); await waitForPages(f.args); assert.equal(f.state.requested, 1);
});
test('fails before request if another writer replaced publication commit', async () => {
  const f = fixture(); f.state.ref = 'b'.repeat(40);
  await assert.rejects(waitForPages(f.args), /changed before/); assert.equal(f.state.requested, 0);
});
test('does not report success for failed, absent or replaced deployments', async () => {
  for (const mutate of [f => f.state.conclusion = 'failure', f => f.state.publishedSha = 'b'.repeat(40), f => f.state.moveAfter = true]) {
    const f = fixture(); mutate(f); await assert.rejects(waitForPages(f.args));
  }
});
