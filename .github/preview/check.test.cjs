const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { check, validate, cleanup } = require('./check.cjs');

function fixture(fork = false) {
  const sha = 'a'.repeat(40);
  const pr = { number: 13, state: 'open', base: { ref: 'main', repo: { full_name: 'lightbug-io/docs' } },
    head: { sha, repo: { id: fork ? 99 : 1 } } };
  const run = { id: 7, event: 'pull_request', status: 'completed', conclusion: 'success',
    repository: { id: 1, full_name: 'lightbug-io/docs' }, workflow_id: 8,
    path: '.github/workflows/preview-build.yml', run_attempt: 2, head_sha: sha,
    head_repository: { id: pr.head.repo.id }, pull_requests: fork ? [] : [{ number: 13 }] };
  const artifact = { id: 9, name: `preview-static-${sha}-2`, expired: false, size_in_bytes: 10,
    workflow_run: { id: 7, head_sha: sha, head_repository_id: pr.head.repo.id } };
  const github = { rest: { actions: {
    getWorkflowRun: async () => ({ data: run }), getWorkflow: async () => ({ data: { id: 8 } }),
    listWorkflowRunArtifacts: 'artifacts',
  }, pulls: { get: async () => ({ data: pr }) }, repos: { listPullRequestsAssociatedWithCommit: 'prs' } },
  paginate: async method => method === 'artifacts' ? [artifact] : [{ number: 13 }] };
  const args = { github, context: { repo: { owner: 'lightbug-io', repo: 'docs' },
    payload: { workflow_run: { id: 7, run_attempt: 2 } } }, core: { setOutput() {} } };
  return { args, pr, run, artifact };
}

test('current same-repository build binds exact artifact', async () => {
  assert.deepEqual(await check(fixture().args), { pr: '13', sha: 'a'.repeat(40), artifact: '9', environment: 'preview-internal' });
});
test('fork with missing run PR metadata resolves using GitHub commit association', async () => {
  assert.equal((await check(fixture(true).args)).environment, 'preview-external');
});
test('rejects stale head, closed PR, wrong repository/workflow/attempt and failed builds', async () => {
  for (const change of [f => f.pr.head.sha = 'b'.repeat(40), f => f.pr.state = 'closed',
    f => f.run.head_repository.id = 404, f => f.run.head_repository = null, f => f.run.workflow_id = 9,
    f => f.run.path = '.github/workflows/other.yml', f => f.run.run_attempt++,
    f => f.run.conclusion = 'failure', f => f.run.event = 'push']) {
    const f = fixture(); change(f); await assert.rejects(check(f.args));
  }
});
test('rejects expired, oversized, substituted and mismatched artifacts', async () => {
  for (const change of [f => f.artifact.expired = true, f => f.artifact.size_in_bytes = 51 * 1024 * 1024,
    f => f.artifact.workflow_run.id++, f => f.artifact.workflow_run.head_sha = 'b'.repeat(40),
    f => f.artifact.workflow_run.head_repository_id++, f => f.artifact.name += '-other']) {
    const f = fixture(); change(f); await assert.rejects(check(f.args));
  }
});
test('approval binds PR, commit and immutable artifact ID', async () => {
  const f = fixture(); f.args.expected = await check(f.args);
  await check(f.args);
  f.artifact.id++;
  await assert.rejects(check(f.args), /changed while awaiting approval/);
});
test('static output accepted; links, repository control files and missing index rejected', t => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'preview-test-'));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  fs.writeFileSync(path.join(directory, 'index.html'), '<p>preview</p>');
  validate(directory);
  fs.symlinkSync('/tmp', path.join(directory, 'escape'));
  assert.throws(() => validate(directory), /regular files/);
  fs.unlinkSync(path.join(directory, 'escape'));
  fs.mkdirSync(path.join(directory, '.git'));
  assert.throws(() => validate(directory), /Unsafe/);
  fs.rmdirSync(path.join(directory, '.git'));
  fs.unlinkSync(path.join(directory, 'index.html'));
  assert.throws(() => validate(directory));
});
test('workflow protects publishing, keeps cleanup metadata-only and disables by default', () => {
  const workflow = fs.readFileSync(path.join(__dirname, '../workflows/preview-publish.yml'), 'utf8');
  assert.match(workflow, /environment: \$\{\{ needs.resolve.outputs.environment \}\}/);
  assert.match(workflow, /vars.PREVIEWS_ENABLED == 'true'/);
  assert.match(workflow, /types: \[closed\]/);
  assert.match(workflow, /\.cleanup\(\{ github, context \}\)/);
  assert.doesNotMatch(workflow, /ref:.*pull_request.head|npm |python|secrets\./);
  assert.equal((workflow.match(/force: false/g) || []).length, 2);
});

test('cleanup accepts closed PRs but refuses a reopened PR', async () => {
  const f = fixture();
  f.args.context.payload.pull_request = { number: 13 };
  await assert.rejects(cleanup(f.args), /reopened/);
  f.pr.state = 'closed';
  await cleanup(f.args);
});
