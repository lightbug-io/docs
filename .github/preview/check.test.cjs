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

test('rejects CNAME because the deploy action preserves it during cleanup', t => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'preview-cname-'));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  fs.writeFileSync(path.join(directory, 'index.html'), '<p>preview</p>');
  fs.writeFileSync(path.join(directory, 'CNAME'), 'unexpected.example');
  assert.throws(() => validate(directory), /Reserved Pages filename/);
});
test('publisher and cleanup use full checkouts for the deploy action worktree', () => {
  const workflow = fs.readFileSync(path.join(__dirname, '../workflows/preview-publish.yml'), 'utf8');
  const privilegedJobs = workflow.slice(workflow.indexOf('  publish:\n'));
  assert.doesNotMatch(privilegedJobs, /sparse-checkout:|merge-multiple:/);
});
test('approval completes before acquiring the shared publish/cleanup lock', () => {
  const workflow = fs.readFileSync(path.join(__dirname, '../workflows/preview-publish.yml'), 'utf8');
  const approval = workflow.split('  approval:\n')[1].split('  publish:\n')[0];
  const publish = workflow.split('  publish:\n')[1].split('  cleanup:\n')[0];
  const cleanup = workflow.split('  cleanup:\n')[1];
  assert.match(approval, /needs: resolve\n/);
  assert.match(approval, /environment: \$\{\{ needs.resolve.outputs.environment \}\}/);
  assert.match(approval, /permissions: \{\}/);
  assert.doesNotMatch(approval, /concurrency:|continue-on-error:|uses:/);
  assert.match(publish, /needs: \[resolve, approval\]\n/);
  assert.doesNotMatch(publish, /environment:|if:|continue-on-error:/);
  for (const job of [publish, cleanup]) {
    assert.match(job, /concurrency:\n      group: pages-preview-publisher\n      cancel-in-progress: false\n      queue: max/);
  }
  assert.match(publish, /EXPECTED: \$\{\{ toJSON\(needs.resolve.outputs\) \}\}/);
  assert.match(publish, /await check\(\{ github, context, core, expected: JSON.parse\(process.env.EXPECTED\) \}\);[\s\S]*uses: JamesIves\//);
});

const branch = require('./branch.cjs');
const pages = require('./branch-pages.cjs');
function branchFixture() {
  const f = fixture();
  Object.assign(f.run, { event: 'push', path: '.github/workflows/branch-preview-build.yml', head_branch: 'topic',
    actor: { login: 'writer' }, triggering_actor: { login: 'writer' }, created_at: '2026-10-20T12:00:00Z' });
  f.artifact.name = `branch-preview-${f.run.head_sha}-2`;
  f.args.context.sha = 'b'.repeat(40);
  f.args.github.rest.git = { getRef: async () => ({ data: { ref: 'refs/heads/topic', object: { type: 'commit', sha: f.pr.head.sha } } }) };
  Object.assign(f.args.github.rest.repos, {
    getContent: async () => ({ data: { type: 'file', sha: 'trusted' } }),
    getCollaboratorPermissionLevel: async () => ({ data: { permission: 'write' } }),
    getCommit: async () => ({ data: { sha: f.run.head_sha, commit: { message: '[ci-preview]' } } }),
  });
  return f;
}
test('branch publication binds trusted workflow, actor, opt-in, source and artifact', async () => {
  assert.equal((await branch.check(branchFixture().args)).id, branch.branchId('topic'));
  for (const mutate of [f => f.artifact.workflow_run.id++, f => f.run.head_repository.id++, f => f.run.run_attempt++,
    f => f.pr.head.sha = 'b'.repeat(40), f => f.run.actor = {},
    f => f.args.github.rest.repos.getCollaboratorPermissionLevel = async () => ({ data: { permission: 'read' } }),
    f => f.args.github.rest.repos.getCommit = async () => ({ data: { sha: f.run.head_sha, commit: { message: 'ordinary push' } } }),
    f => f.args.github.rest.repos.getContent = async ({ ref }) => ({ data: { type: 'file', sha: ref } })]) {
    const f = branchFixture(); mutate(f); await assert.rejects(branch.check(f.args));
  }
  for (const name of ['../pr', 'main', 'gh-pages', 'a\nb']) assert.throws(() => branch.branchId(name));
  assert.notEqual(branch.branchId('a/b'), branch.branchId('a-b'));
});
function pagesFixture(previews, removals = []) {
  const manifest = { version: 1, previews, removals }, writes = [];
  const entries = [pages.MANIFEST, 'pr/13/index.html', 'unrelated.txt', ...previews.map(p => `branch/${p.id}/index.html`)]
    .map(path => ({ path, type: 'blob', mode: '100644', sha: 'blob', size: 100 }));
  const git = {
    getRef: async () => ({ data: { object: { sha: 'parent' } } }),
    getCommit: async () => ({ data: { tree: { sha: 'base' } } }),
    getTree: async () => ({ data: { tree: entries, truncated: false } }),
    getBlob: async () => ({ data: { encoding: 'base64', content: Buffer.from(JSON.stringify(manifest)).toString('base64') } }),
    createTree: async ({ tree }) => { writes.push(...tree); return { data: { sha: 'updated' } }; },
    createCommit: async ({ parents }) => { assert.deepEqual(parents, ['parent']); return { data: { sha: 'commit' } }; },
    updateRef: async ({ force }) => assert.equal(force, false),
  };
  return { writes, args: { github: { rest: { git } }, context: { repo: { owner: 'lightbug-io', repo: 'docs' } }, now: '2026-10-23T12:00:00.000Z' } };
}
const preview = (name, publishedAt, runId = '10') => ({ branch: name, id: branch.branchId(name), sha: 'a'.repeat(40), publishedAt, runId });
test('expiry and manual cleanup preserve current/unknown/PR files and bind non-force parent', async () => {
  const old = preview('old', '2026-09-01T12:00:00.000Z'), fresh = preview('new', '2026-10-23T12:00:00.000Z');
  const f = pagesFixture([old, fresh]);
  await pages.cleanup({ ...f.args, branch: fresh.branch, requestedAt: '2026-10-23T11:00:00.000Z' });
  assert.deepEqual(f.writes.filter(e => e.sha === null).map(e => e.path), [`branch/${old.id}/index.html`]);
  assert.throws(() => pages.validateManifest({ version: 1, previews: [{ ...old, id: '../pr' }], removals: [] }));
  await assert.rejects(pages.cleanup({ ...f.args, branch: 'unknown', requestedAt: f.args.now }), /No managed preview/);
});
test('older queued builds cannot replace a newer preview or resurrect manual cleanup', async t => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'branch-race-'));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  fs.writeFileSync(path.join(directory, 'index.html'), 'preview');
  const p = preview('topic', '2026-10-23T12:00:00.000Z');
  const expected = { ...p, runId: '9', createdAt: '2026-10-23T11:00:00.000Z' };
  await assert.rejects(pages.publish({ ...pagesFixture([p]).args, directory, expected }), /newer preview/);
  const removed = pagesFixture([], [{ branch: p.branch, id: p.id, requestedAt: p.publishedAt }]);
  await assert.rejects(pages.publish({ ...removed.args, directory, expected }), /manually removed/);
});
