'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { branchId, check } = require('./branch.cjs');
const sha = 'a'.repeat(40), trusted = 'b'.repeat(40);
function fixture() {
  const run = { id: 7, event: 'push', status: 'completed', conclusion: 'success',
    repository: { id: 1, full_name: 'lightbug-io/docs' }, head_repository: { id: 1 },
    workflow_id: 8, path: '.github/workflows/branch-preview-build.yml', run_attempt: 2,
    head_sha: sha, head_branch: 'feature/example', actor: { login: 'writer' }, triggering_actor: { login: 'writer' },
    created_at: '2026-10-20T12:00:00Z' };
  const artifact = { id: 9, name: `branch-preview-${sha}-2`, size_in_bytes: 10, expired: false,
    workflow_run: { id: 7, head_sha: sha, head_repository_id: 1 } };
  const state = { message: 'docs: prototype [ci-preview]', permission: 'write', fileSha: 'same', branchSha: sha };
  const github = { rest: { actions: {
    getWorkflowRun: async () => ({ data: run }), getWorkflow: async () => ({ data: { id: 8 } }), listWorkflowRunArtifacts() {},
  }, git: { getRef: async () => ({ data: { ref: `refs/heads/${run.head_branch}`, object: { type: 'commit', sha: state.branchSha } } }) },
  repos: {
    getContent: async ({ ref }) => ({ data: { type: 'file', sha: ref === trusted ? 'same' : state.fileSha } }),
    getCollaboratorPermissionLevel: async () => ({ data: { permission: state.permission } }),
    getCommit: async () => ({ data: { sha, commit: { message: state.message } } }),
  } }, paginate: async () => [artifact] };
  return { run, artifact, state, args: { github, context: { repo: { owner: 'lightbug-io', repo: 'docs' }, sha: trusted,
    payload: { workflow_run: { id: 7, run_attempt: 2 } } }, core: { setOutput() {} } } };
}
test('push opt-in and manual branch build bind trusted definition and exact artifact', async () => {
  const f = fixture(); const result = await check(f.args);
  assert.equal(result.id, branchId(f.run.head_branch)); assert.equal(result.artifact, '9');
  f.run.event = 'workflow_dispatch'; f.state.message = 'no token'; await check(f.args);
});
test('rejects forged workflow, fork, moved ref, no token/permission and stale artifact attempts', async () => {
  const mutations = [f => f.run.event = 'pull_request', f => f.run.conclusion = 'failure',
    f => f.run.repository.full_name = 'other/docs', f => f.run.head_repository.id = 2,
    f => f.run.workflow_id = 99, f => f.run.path = '.github/workflows/forged.yml',
    f => f.run.run_attempt++, f => f.state.fileSha = 'modified', f => f.state.branchSha = trusted,
    f => f.state.permission = 'read', f => f.state.message = 'ordinary push', f => f.run.actor = {},
    f => f.run.triggering_actor = {}, f => f.artifact.workflow_run.id++, f => f.artifact.workflow_run.head_sha = trusted,
    f => f.artifact.workflow_run.head_repository_id++, f => f.artifact.expired = true,
    f => f.artifact.name = `branch-preview-${sha}-1`, f => f.artifact.size_in_bytes = 99e6,
    f => f.run.head_branch = 'gh-pages'];
  for (const mutate of mutations) { const f = fixture(); mutate(f); await assert.rejects(check(f.args)); }
});
test('both actors checked; exact expected metadata revalidated', async () => {
  const f = fixture(); f.run.triggering_actor.login = 'reader';
  f.args.github.rest.repos.getCollaboratorPermissionLevel = async ({ username }) => ({ data: { permission: username === 'reader' ? 'read' : 'write' } });
  await assert.rejects(check(f.args));
  const good = fixture(); const expected = await check(good.args);
  await assert.rejects(check({ ...good.args, expected: { ...expected, artifact: '55' } }));
});
test('branch identity is bounded and slash/slug collisions do not collide', () => {
  assert.notEqual(branchId('a/b'), branchId('a-b'));
  for (const branch of ['', '../bad', 'a..b', 'a b', '-bad/.hidden', 'a.lock', '/a', 'a/', 'main', 'production', 'gh-pages', 'a\ncommand'])
    assert.throws(() => branchId(branch));
  assert.match(branchId('feature/ümlaut'), /^[a-f0-9]{64}$/);
});
module.exports = { fixture };
