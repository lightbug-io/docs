'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { createHash } = require('node:crypto');
const { branchId } = require('./branch.cjs');
const { cleanup, publish, commitChanges, MANIFEST, MAX_AGE } = require('./branch-pages.cjs');
const now = '2026-10-23T12:00:00.000Z', old = '2026-09-01T12:00:00.000Z';
const iso = n => new Date(Date.parse(now) + n).toISOString();
const record = (branch, publishedAt = old, runId = '7') => ({ id: branchId(branch), branch, sha: 'a'.repeat(40), runId, publishedAt });
function fixture(previews = [], removals = []) {
  const blobs = new Map(), trees = new Map(), commits = new Map(), calls = [];
  const digest = value => createHash('sha1').update(value).digest('hex');
  const blob = text => { const sha = digest(text); blobs.set(sha, text); return sha; };
  let head = 'first'; let tree = new Map();
  for (const p of previews) tree.set(`branch/${p.id}/index.html`, blob('old'));
  for (const file of ['pr/42/index.html', '.nojekyll', 'unrelated.txt', 'branch/unowned/index.html']) tree.set(file, blob(file));
  tree.set(MANIFEST, blob(JSON.stringify({ version: 1, previews, removals })));
  trees.set('base-tree', tree); commits.set(head, { tree: { sha: 'base-tree' } });
  const state = { truncated: false, race: false, calls, get files() { return trees.get(commits.get(head).tree.sha); },
    manifest() { return JSON.parse(blobs.get(this.files.get(MANIFEST))); }, get head() { return head; } };
  const git = {
    getRef: async ({ ref }) => ({ data: { ref: `refs/${ref}`, object: { sha: ref === 'heads/gh-pages' ? head : 'a'.repeat(40) } } }),
    getCommit: async ({ commit_sha }) => ({ data: commits.get(commit_sha) }),
    getTree: async ({ tree_sha }) => ({ data: { truncated: state.truncated, tree: [...trees.get(tree_sha)].map(([path, sha]) => ({ path, sha, mode: '100644', type: 'blob', size: Buffer.byteLength(blobs.get(sha)) })) } }),
    getBlob: async ({ file_sha }) => ({ data: { encoding: 'base64', content: Buffer.from(blobs.get(file_sha)).toString('base64') } }),
    createBlob: async ({ content }) => ({ data: { sha: blob(Buffer.from(content, 'base64').toString('binary')) } }),
    createTree: async ({ base_tree, tree: changes }) => {
      const updated = new Map(trees.get(base_tree));
      for (const e of changes) e.sha === null ? updated.delete(e.path) : updated.set(e.path, e.sha || blob(e.content));
      const serialized = JSON.stringify([...updated].sort());
      if (serialized === JSON.stringify([...trees.get(base_tree)].sort())) return { data: { sha: base_tree } };
      const sha = digest(serialized); trees.set(sha, updated); return { data: { sha } };
    },
    createCommit: async ({ tree, parents, message }) => { const sha = `commit-${calls.length}`; calls.push({ tree, parents, message }); commits.set(sha, { tree: { sha: tree } }); return { data: { sha } }; },
    updateRef: async ({ sha, force }) => { assert.equal(force, false); if (state.race) throw Error('non-fast-forward'); head = sha; },
  };
  const github = { rest: { git } };
  const writePublication = ({ repo, state, changes, message, beforeUpdate }) => commitChanges(github, repo, state, changes.map(e => e.localFile ? { path: e.path, mode: '100644', type: 'blob', content: fs.readFileSync(e.localFile, 'utf8') } : e), message, beforeUpdate);
  return { state, args: { writePublication, github, context: { repo: { owner: 'lightbug-io', repo: 'docs' } }, now } };
}
test('30-day cleanup touches only owned expired branch files, not exact boundary/new/unknown/PR/root', async () => {
  const expired = record('old'), boundary = record('boundary', iso(-MAX_AGE)), fresh = record('fresh', now);
  const f = fixture([expired, boundary, fresh]); await cleanup(f.args);
  assert(!f.state.files.has(`branch/${expired.id}/index.html`));
  for (const p of [boundary, fresh]) assert(f.state.files.has(`branch/${p.id}/index.html`));
  for (const file of ['pr/42/index.html', '.nojekyll', 'unrelated.txt', 'branch/unowned/index.html']) assert(f.state.files.has(file));
  assert.equal(f.state.calls.length, 1); await cleanup(f.args); assert.equal(f.state.calls.length, 1);
});
test('manual cleanup can remove deleted source branch; replay does not remove newer publication', async () => {
  const p = record('deleted-source', now), f = fixture([p]);
  await cleanup({ ...f.args, branch: p.branch, requestedAt: iso(-1000) });
  assert(f.state.files.has(`branch/${p.id}/index.html`));
  await cleanup({ ...f.args, branch: p.branch, requestedAt: iso(1000) });
  assert(!f.state.files.has(`branch/${p.id}/index.html`));
  const n = f.state.calls.length; await cleanup({ ...f.args, branch: p.branch, requestedAt: iso(1000) }); assert.equal(f.state.calls.length, n);
});
test('separate cleanup and publication commits use fresh parent; metadata cannot come from artifact', async t => {
  const f = fixture([record('old')]), directory = fs.mkdtempSync(path.join(os.tmpdir(), 'branch-preview-'));
  t.after(() => fs.rmSync(directory, { recursive: true })); fs.writeFileSync(path.join(directory, 'index.html'), 'new');
  const expected = { ...record('new', now, '8'), createdAt: iso(-1000) };
  await cleanup(f.args); const cleanupCommit = f.state.head;
  await publish({ ...f.args, expected, directory });
  assert.equal(f.state.calls.length, 2); assert.deepEqual(f.state.calls[1].parents, [cleanupCommit]);
  assert.equal(f.state.manifest().previews[0].publishedAt, now);
  fs.writeFileSync(path.join(directory, MANIFEST), '{}');
  await assert.rejects(publish({ ...f.args, expected, directory }), /Unsafe artifact/);
});
test('rejects truncated tree, corrupt identity/future timestamps, and non-fast-forward without retry', async () => {
  const f = fixture([record('old')]); f.state.truncated = true; await assert.rejects(cleanup(f.args), /truncated/);
  const bad = fixture([{ ...record('bad'), id: '../pr' }]); await assert.rejects(cleanup(bad.args));
  const future = fixture([record('future', iso(1))]); await assert.rejects(cleanup(future.args), /Future/);
  const race = fixture([record('old')]); race.state.race = true; await assert.rejects(cleanup(race.args), /non-fast-forward/); assert.equal(race.state.calls.length, 1);
});
test('manual removal blocks old in-flight builds; stale run cannot overwrite newer preview', async t => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'branch-preview-'));
  t.after(() => fs.rmSync(directory, { recursive: true })); fs.writeFileSync(path.join(directory, 'index.html'), 'new');
  const p = record('topic', now, '10'), expected = { ...p, runId: '9', createdAt: iso(-2000) };
  const newer = fixture([p]); await assert.rejects(publish({ ...newer.args, expected, directory }), /newer preview/);
  const removed = fixture([], [{ id: p.id, branch: p.branch, requestedAt: iso(-1000) }]);
  await assert.rejects(publish({ ...removed.args, expected, directory }), /manually removed/);
  await publish({ ...removed.args, expected: { ...expected, createdAt: now }, directory });
});
test('unknown manual targets fail; unowned hashed directories cannot be overwritten', async t => {
  const f = fixture(); await assert.rejects(cleanup({ ...f.args, branch: 'unknown', requestedAt: now }), /No managed preview/);
  const expected = { ...record('unknown'), createdAt: now };
  f.state.files.set(`branch/${expected.id}/index.html`, f.state.files.get('unrelated.txt'));
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'branch-preview-'));
  t.after(() => fs.rmSync(directory, { recursive: true })); fs.writeFileSync(path.join(directory, 'index.html'), 'new');
  await assert.rejects(publish({ ...f.args, expected, directory }), /unowned/);
});
test('source branch moving during preparation prevents ref update', async t => {
  const f = fixture(), directory = fs.mkdtempSync(path.join(os.tmpdir(), 'branch-preview-'));
  t.after(() => fs.rmSync(directory, { recursive: true })); fs.writeFileSync(path.join(directory, 'index.html'), 'new');
  const original = f.args.github.rest.git.getRef;
  f.args.github.rest.git.getRef = async args => args.ref === 'heads/topic' ? { data: { ref: 'refs/heads/topic', object: { sha: 'b'.repeat(40) } } } : original(args);
  await assert.rejects(publish({ ...f.args, expected: { ...record('topic'), createdAt: now }, directory }), /Source branch moved/);
  assert.equal(f.state.head, 'first');
});
