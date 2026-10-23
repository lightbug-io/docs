'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
// Git objects/index only: never check out or execute any gh-pages/artifact files.
// A single pack push avoids REST request-size and per-blob rate limits.
async function writePublication({ repo, state, changes, message, token, beforeUpdate,
  runGit = (args, options) => execFileSync('git', args, options).toString().trim() }) {
  assert(/^[\w.-]+$/.test(repo.owner) && /^[\w.-]+$/.test(repo.repo), 'Invalid repository identity');
  assert(typeof token === 'string' && token.length > 0, 'Missing publication token');
  const cwd = fs.mkdtempSync(path.join(os.tmpdir(), 'branch-preview-git-'));
  const env = { ...process.env, GIT_CONFIG_SYSTEM: '/dev/null', GIT_CONFIG_GLOBAL: '/dev/null',
    GIT_CONFIG_COUNT: '2', GIT_CONFIG_KEY_0: 'http.https://github.com/.extraheader',
    GIT_CONFIG_VALUE_0: `AUTHORIZATION: basic ${Buffer.from(`x-access-token:${token}`).toString('base64')}`,
    GIT_CONFIG_KEY_1: 'core.hooksPath', GIT_CONFIG_VALUE_1: '/dev/null',
    GIT_AUTHOR_NAME: 'github-actions[bot]', GIT_COMMITTER_NAME: 'github-actions[bot]',
    GIT_AUTHOR_EMAIL: '41898282+github-actions[bot]@users.noreply.github.com',
    GIT_COMMITTER_EMAIL: '41898282+github-actions[bot]@users.noreply.github.com',
    GIT_TERMINAL_PROMPT: '0', GIT_TRACE: '0', GIT_TRACE_CURL: '0', GIT_CURL_VERBOSE: '0' };
  const git = (args, input) => runGit(args, { cwd, env, input, encoding: 'utf8', maxBuffer: 10 * 1024 * 1024, stdio: ['pipe', 'pipe', 'pipe'] });
  try {
    git(['init', '--quiet']);
    git(['remote', 'add', 'origin', `https://github.com/${repo.owner}/${repo.repo}.git`]);
    git(['fetch', '--quiet', '--depth=1', 'origin', 'refs/heads/gh-pages']);
    assert(git(['rev-parse', 'FETCH_HEAD']) === state.parent, 'Pages changed during publication preparation');
    git(['read-tree', state.parent]);
    const index = [];
    for (const entry of changes) {
      if (entry.sha === null) index.push(`0 ${'0'.repeat(40)}\t${entry.path}\0`);
      else {
        const sha = entry.localFile ? git(['hash-object', '-w', '--no-filters', '--', entry.localFile])
          : git(['hash-object', '-w', '--no-filters', '--stdin'], entry.content);
        assert(/^[0-9a-f]{40}$/.test(sha), 'Invalid local blob');
        index.push(`100644 ${sha}\t${entry.path}\0`);
      }
    }
    git(['update-index', '-z', '--index-info'], index.join(''));
    const tree = git(['write-tree']);
    if (tree === state.tree) return state.parent;
    const commit = git(['commit-tree', tree, '-p', state.parent], message + '\n');
    assert(/^[0-9a-f]{40}$/.test(commit), 'Invalid local commit');
    await beforeUpdate();
    git(['push', '--quiet', 'origin', `${commit}:refs/heads/gh-pages`]); // no force
    return commit;
  } finally { fs.rmSync(cwd, { recursive: true, force: true }); }
}
module.exports = { writePublication };
