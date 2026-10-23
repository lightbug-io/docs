'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { branchId } = require('./branch.cjs');
const MANIFEST = '.branch-previews.json';
const MAX_AGE = 30 * 24 * 60 * 60 * 1000;
function date(value) {
  assert(typeof value === 'string' && new Date(value).toISOString() === value, 'Invalid publication timestamp');
  return Date.parse(value);
}
function validateManifest(manifest) {
  assert(manifest?.version === 1 && Array.isArray(manifest.previews) && Array.isArray(manifest.removals), 'Invalid branch manifest');
  const ids = new Set();
  for (const p of manifest.previews) {
    assert(p.id === branchId(p.branch) && !ids.has(p.id), 'Invalid/duplicate preview identity');
    ids.add(p.id);
    assert(/^[0-9a-f]{40}$/.test(p.sha) && /^[1-9]\d*$/.test(p.runId), 'Invalid preview provenance');
    date(p.publishedAt);
  }
  const removed = new Set();
  for (const r of manifest.removals) {
    assert(r.id === branchId(r.branch) && !removed.has(r.id), 'Invalid/duplicate removal identity');
    removed.add(r.id); date(r.requestedAt);
  }
  return manifest;
}
async function snapshot(github, repo) {
  const { data: ref } = await github.rest.git.getRef({ ...repo, ref: 'heads/gh-pages' });
  const { data: commit } = await github.rest.git.getCommit({ ...repo, commit_sha: ref.object.sha });
  const { data: tree } = await github.rest.git.getTree({ ...repo, tree_sha: commit.tree.sha, recursive: '1' });
  assert(!tree.truncated, 'Pages tree is truncated; refusing partial cleanup');
  const entry = tree.tree.find(e => e.path === MANIFEST);
  let manifest = { version: 1, previews: [], removals: [] };
  if (entry) {
    assert(entry.type === 'blob' && entry.mode === '100644' && entry.size < 1024 * 1024, 'Unsafe branch manifest');
    const { data: blob } = await github.rest.git.getBlob({ ...repo, file_sha: entry.sha });
    assert(blob.encoding === 'base64', 'Unexpected manifest encoding');
    manifest = validateManifest(JSON.parse(Buffer.from(blob.content, 'base64').toString('utf8')));
  }
  return { parent: ref.object.sha, tree: commit.tree.sha, entries: tree.tree, manifest };
}
function deletions(entries, ids) {
  return entries.filter(e => e.type !== 'tree' && ids.some(id => e.path.startsWith(`branch/${id}/`)))
    .map(e => ({ path: e.path, mode: e.mode, type: e.type, sha: null }));
}
async function commitChanges(github, repo, state, changes, message, beforeUpdate = async () => {}) {
  const { data: tree } = await github.rest.git.createTree({ ...repo, base_tree: state.tree, tree: changes });
  if (tree.sha === state.tree) return state.parent;
  const { data: commit } = await github.rest.git.createCommit({ ...repo, message, tree: tree.sha, parents: [state.parent] });
  // Never force or retry against a changed ref: a non-cooperating writer fails safely.
  await beforeUpdate();
  await github.rest.git.updateRef({ ...repo, ref: 'heads/gh-pages', sha: commit.sha, force: false });
  return commit.sha;
}
function manifestChange(manifest) {
  return { path: MANIFEST, mode: '100644', type: 'blob', content: JSON.stringify(manifest, null, 2) + '\n' };
}
// Call only from trusted main, holding pages-preview-publisher for the entire job.
// It creates its own commit before any subsequent PR/branch publication commit.
async function cleanup({ github, context, branch, requestedAt, now = new Date().toISOString() }) {
  const state = await snapshot(github, context.repo);
  const cutoff = date(now) - MAX_AGE;
  assert(state.manifest.previews.every(p => date(p.publishedAt) <= date(now)), 'Future-dated publication metadata');
  const id = branch === undefined ? undefined : branchId(branch);
  if (id) {
    date(requestedAt);
    assert(state.manifest.previews.some(p => p.id === id) || state.manifest.removals.some(r => r.id === id),
      'No managed preview exists for this branch');
  }
  const remove = state.manifest.previews.filter(p => date(p.publishedAt) < cutoff
    || (p.id === id && date(p.publishedAt) <= date(requestedAt)));
  state.manifest.previews = state.manifest.previews.filter(p => !remove.includes(p));
  if (id) {
    const old = state.manifest.removals.find(r => r.id === id);
    if (!old || date(old.requestedAt) < date(requestedAt)) {
      state.manifest.removals = state.manifest.removals.filter(r => r.id !== id);
      state.manifest.removals.push({ id, branch, requestedAt });
    }
  }
  if (!remove.length && !id) return state.parent;
  const changes = deletions(state.entries, remove.map(p => p.id));
  changes.push(manifestChange(state.manifest));
  return commitChanges(github, context.repo, state, changes, 'Remove expired or requested branch previews');
}
async function publish({ github, context, expected, directory, token,
  writePublication = require('./branch-git.cjs').writePublication, now = new Date().toISOString() }) {
  require('./check.cjs').validate(directory);
  assert(expected.id === branchId(expected.branch), 'Invalid branch destination');
  const state = await snapshot(github, context.repo);
  const previous = state.manifest.previews.find(p => p.id === expected.id);
  assert(previous || !state.entries.some(e => e.path === `branch/${expected.id}` || e.path.startsWith(`branch/${expected.id}/`)),
    'Refusing to replace an unowned branch directory');
  assert(!previous || BigInt(previous.runId) <= BigInt(expected.runId), 'A newer preview was already published');
  const removal = state.manifest.removals.find(r => r.id === expected.id);
  assert(!removal || Date.parse(expected.createdAt) > date(removal.requestedAt), 'Preview was manually removed; start a new build');
  const changes = new Map(deletions(state.entries, [expected.id]).map(e => [e.path, e]));
  async function visit(dir, relative = '') {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const local = path.join(dir, entry.name), rel = relative + entry.name;
      if (entry.isDirectory()) await visit(local, rel + '/');
      else {
        const target = `branch/${expected.id}/${rel}`;
        changes.set(target, { path: target, localFile: path.resolve(local) });
      }
    }
  }
  await visit(directory);
  state.manifest.previews = state.manifest.previews.filter(p => p.id !== expected.id);
  state.manifest.previews.push({ id: expected.id, branch: expected.branch, sha: expected.sha, runId: expected.runId, publishedAt: new Date(date(now)).toISOString() });
  changes.set(MANIFEST, manifestChange(state.manifest));
  return writePublication({ repo: context.repo, state, changes: [...changes.values()], token,
    message: `Publish branch preview ${expected.id} at ${expected.sha}`, beforeUpdate: async () => {
      const { data: ref } = await github.rest.git.getRef({ ...context.repo, ref: `heads/${expected.branch}` });
      assert(ref.ref === `refs/heads/${expected.branch}` && ref.object.sha === expected.sha, 'Source branch moved before publication');
    } });
}
module.exports = { MAX_AGE, MANIFEST, validateManifest, deletions, snapshot, cleanup, publish, commitChanges };
