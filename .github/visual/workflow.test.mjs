import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const { resolve, announce, artifactName } = createRequire(import.meta.url)('./workflow.cjs');
const A = 'a'.repeat(40), B = 'b'.repeat(40), C = 'c'.repeat(40);
process.env.GITHUB_RUN_ATTEMPT = '2';
function fixture() {
  const context = { eventName: 'workflow_dispatch', ref: 'refs/heads/main', sha: A, runId: 42, repo: { owner: 'org', repo: 'docs' }, payload: { inputs: { pr: '7' } } };
  const repository = { id: 11, full_name: 'org/docs', default_branch: 'main' };
  const pr = { number: 7, state: 'open', merged: false, base: { ref: 'main', sha: A, repo: repository }, head: { sha: C, repo: { id: 22, full_name: 'contributor/docs', name: 'docs', owner: { login: 'contributor' } } } };
  const expected = { pr: '7', base: B, head: C, repo: 'contributor/docs', repositoryId: '11', headRepositoryId: '22', run: '42', attempt: '2', workflowSha: A };
  const run = { id: 42, run_attempt: 2, workflow_id: 3, event: 'workflow_dispatch', head_branch: 'main', head_sha: A, repository, head_repository: repository };
  const workflow = { id: 3, path: '.github/workflows/visual-diff.yml' };
  const artifact = { id: 99, name: artifactName(expected), expired: false, size_in_bytes: 1234, workflow_run: { id: 42, head_sha: A, repository_id: 11, head_repository_id: 11 } };
  const artifacts = [artifact], comments = [], calls = [], outputs = {};
  const github = { rest: {
    repos: { get: async () => ({ data: repository }), compareCommitsWithBasehead: async args => { calls.push(args); return { data: { merge_base_commit: { sha: B } } }; } },
    pulls: { get: async () => ({ data: pr }) },
    actions: { getWorkflowRun: async () => ({ data: run }), getWorkflow: async () => ({ data: workflow }), listWorkflowRunArtifacts: Symbol('artifacts') },
    issues: { listComments: Symbol('comments'), createComment: async args => calls.push({ create: args }), updateComment: async args => calls.push({ update: args }) },
  }, paginate: async method => method === github.rest.actions.listWorkflowRunArtifacts ? artifacts : comments };
  const args = { github, context, expected, captureResult: 'success', uploadResult: 'success', core: { setOutput: (k, v) => { outputs[k] = v; } } };
  return { args, pr, run, repository, workflow, artifact, artifacts, comments, calls, outputs };
}
test('resolve binds numeric PR, fork identity, exact head and merge base', async () => {
  const f = fixture();
  assert.deepEqual(await resolve(f.args), f.args.expected);
  assert.deepEqual(f.outputs, f.args.expected);
  assert.equal(f.calls[0].basehead, `${A}...contributor:${C}`);
});
for (const value of ['0', '-1', '7;echo nope', '1.5', 'NaN', '9007199254740992', '']) {
  test(`reject malformed PR input ${JSON.stringify(value)}`, async () => {
    const f = fixture(); f.args.context.payload.inputs.pr = value;
    await assert.rejects(resolve(f.args), /Invalid numeric ID/);
  });
}
for (const [name, mutate] of [
  ['non-main dispatch', f => { f.args.context.ref = 'refs/heads/feature'; }],
  ['wrong event', f => { f.args.context.eventName = 'pull_request_target'; }],
  ['closed PR', f => { f.pr.state = 'closed'; }],
  ['wrong base branch', f => { f.pr.base.ref = 'next'; }],
  ['wrong base repository', f => { f.pr.base.repo = { id: 99, full_name: 'evil/docs' }; }],
  ['wrong default branch', f => { f.repository.default_branch = 'next'; }],
  ['fork identity mismatch', f => { f.pr.head.repo.full_name = 'another/docs'; }],
  ['missing fork', f => { f.pr.head.repo = null; }],
  ['invalid SHA', f => { f.pr.head.sha = 'not-a-sha'; }],
]) test(`resolve rejects ${name}`, async () => { const f = fixture(); mutate(f); await assert.rejects(resolve(f.args)); });
test('comment uses verified artifact metadata, not untrusted artifact content', async () => {
  const f = fixture(); const body = await announce(f.args);
  assert.match(body, /actions\/runs\/42\/artifacts\/99/);
  assert.match(body, /Sign in/); assert.match(body, /7 days/); assert.match(body, /Report only/);
  assert.equal(f.calls.filter(c => c.create).length, 1);
});
for (const [name, mutate] of [
  ['stale head', f => { f.pr.head.sha = B; }],
  ['changed fork', f => { f.pr.head.repo.id = 55; }],
  ['wrong run', f => { f.run.id = 43; }],
  ['wrong attempt', f => { f.run.run_attempt = 1; }],
  ['wrong workflow', f => { f.workflow.path = '.github/workflows/preview-build.yml'; }],
  ['wrong workflow ID', f => { f.workflow.id = 4; }],
  ['PR head instead of trusted workflow SHA', f => { f.run.head_sha = C; }],
  ['wrong run event', f => { f.run.event = 'pull_request'; }],
  ['wrong run repository', f => { f.run.head_repository = { id: 22 }; }],
  ['wrong artifact run', f => { f.artifact.workflow_run.id = 43; }],
  ['wrong artifact SHA', f => { f.artifact.workflow_run.head_sha = C; }],
  ['wrong artifact repository', f => { f.artifact.workflow_run.repository_id = 99; }],
  ['missing artifact binding', f => { delete f.artifact.workflow_run; }],
  ['expired artifact', f => { f.artifact.expired = true; }],
  ['zero-size artifact', f => { f.artifact.size_in_bytes = 0; }],
  ['duplicate artifacts', f => { f.artifacts.push({ ...f.artifact, id: 100 }); }],
]) test(`comment rejects ${name}`, async () => { const f = fixture(); mutate(f); await assert.rejects(announce(f.args)); assert.equal(f.calls.length, 0); });
test('missing report and failed upload produce useful status without download link', async () => {
  for (const uploadResult of ['failure', 'skipped', '']) {
    const f = fixture(); f.artifacts.length = 0; f.args.captureResult = 'failure'; f.args.uploadResult = uploadResult;
    const body = await announce(f.args); assert.match(body, /No downloadable report/); assert.doesNotMatch(body, /Download report artifact/);
  }
});
test('failed capture may still link its uploaded error report', async () => {
  const f = fixture(); f.args.captureResult = 'failure'; assert.match(await announce(f.args), /Download report artifact/);
});
test('unrelated artifact is never used as fallback', async () => {
  const f = fixture(); f.artifact.name = 'other'; assert.match(await announce(f.args), /No downloadable report/);
});
test('updates only the single exact bot-owned marker, idempotently', async () => {
  const f = fixture(); const body = await announce(f.args); f.calls.length = 0;
  f.comments.push({ id: 10, user: { type: 'User', login: 'github-actions[bot]' }, body }, { id: 11, user: { type: 'Bot', login: 'other[bot]' }, body }, { id: 12, user: { type: 'Bot', login: 'github-actions[bot]' }, body });
  await announce(f.args); assert.equal(f.calls.length, 1); assert.equal(f.calls[0].update.comment_id, 12); assert.equal(f.calls[0].update.body, body);
});
test('ambiguous bot-owned comments fail closed', async () => {
  const f = fixture(); const body = await announce(f.args); f.calls.length = 0;
  for (const id of [10, 11]) f.comments.push({ id, user: { type: 'Bot', login: 'github-actions[bot]' }, body });
  await assert.rejects(announce(f.args), /Ambiguous bot report comments/);
});

test('rechecks the current PR immediately before posting', async () => {
  const f = fixture(); let reads = 0;
  f.args.github.rest.pulls.get = async () => {
    reads++;
    return { data: reads === 1 ? f.pr : { ...f.pr, head: { ...f.pr.head, sha: B } } };
  };
  await assert.rejects(announce(f.args), /PR head changed before comment/);
  assert.equal(f.calls.length, 0);
});
