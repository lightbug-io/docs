'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { writePublication } = require('./branch-git.cjs');
function fixture(t) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'branch-git-test-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const remote = path.join(dir, 'remote.git'), source = path.join(dir, 'source');
  fs.mkdirSync(source);
  const command = (args, cwd = source) => execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
  command(['init', '--bare', remote]); command(['init', '-q']);
  command(['config', 'user.name', 'Test']); command(['config', 'user.email', 'test@example.invalid']);
  fs.writeFileSync(path.join(source, 'unrelated.txt'), 'preserved');
  fs.writeFileSync(path.join(source, '.gitattributes'), '* text=auto eol=lf\n');
  fs.mkdirSync(path.join(source, 'branch', 'abc'), { recursive: true });
  fs.writeFileSync(path.join(source, 'branch', 'abc', 'old.txt'), 'obsolete');
  command(['add', '.']); command(['commit', '-qm', 'Initial']);
  command(['push', remote, 'HEAD:refs/heads/gh-pages']);
  const state = { parent: command(['rev-parse', 'HEAD']), tree: command(['rev-parse', 'HEAD^{tree}']) };
  const calls = [];
  const runGit = (args, options) => {
    calls.push(args);
    assert(!args.join(' ').includes('test-token'));
    assert.equal(options.env.GIT_CONFIG_GLOBAL, '/dev/null');
    assert.equal(options.env.GIT_CONFIG_VALUE_1, '/dev/null');
    assert(!args.includes('--force'));
    // The only network commands are redirected to a local test-only bare repo.
    const local = ['fetch', 'push'].includes(args[0]) ? args.map(a => a === 'origin' ? remote : a) : args;
    return execFileSync('git', local, options).toString().trim();
  };
  return { source, remote, command, calls, args: { repo: { owner: 'lightbug-io', repo: 'docs' }, state,
    token: 'test-token', runGit, message: 'Publish preview', beforeUpdate: async () => {} } };
}
test('one non-force pack push preserves unrelated files and binary bytes without checkout', async t => {
  const f = fixture(t), binary = path.join(f.source, 'binary'); fs.writeFileSync(binary, Buffer.from([0, 255, 20]));
  const crlf = path.join(f.source, 'crlf.txt'); fs.writeFileSync(crlf, 'first\r\nsecond\r\n');
  const commit = await writePublication({ ...f.args, changes: [
    { path: 'branch/abc/old.txt', sha: null }, { path: 'branch/abc/image.bin', localFile: binary },
    { path: 'branch/abc/crlf.txt', localFile: crlf },
    { path: '.branch-previews.json', content: '{"version":1}\n' },
  ] });
  const files = f.command(['--git-dir', f.remote, 'ls-tree', '-r', '--name-only', commit]);
  assert(files.includes('unrelated.txt')); assert(!files.includes('old.txt')); assert(files.includes('image.bin'));
  assert.deepEqual(execFileSync('git', ['--git-dir', f.remote, 'show', `${commit}:branch/abc/image.bin`]), Buffer.from([0, 255, 20]));
  assert.equal(f.command(['--git-dir', f.remote, 'show', `${commit}:branch/abc/crlf.txt`]), 'first\r\nsecond');
  assert(f.calls.filter(a => a[0] === 'hash-object').every(a => a.includes('--no-filters')));
  assert.equal(f.calls.filter(a => a[0] === 'push').length, 1);
  assert(!f.calls.some(a => ['checkout', 'switch', 'submodule'].includes(a[0])));
});
test('skips empty commits/pushes and rejects changed remote/source before push', async t => {
  const f = fixture(t);
  assert.equal(await writePublication({ ...f.args, changes: [] }), f.args.state.parent);
  assert(!f.calls.some(a => a[0] === 'push'));
  await assert.rejects(writePublication({ ...f.args, state: { ...f.args.state, parent: 'a'.repeat(40) }, changes: [] }), /Pages changed/);
  await assert.rejects(writePublication({ ...f.args, changes: [{ path: 'branch/abc/new.txt', content: 'new' }],
    beforeUpdate: async () => { throw Error('Source moved'); } }), /Source moved/);
  assert(!f.calls.some(a => a[0] === 'push'));
});
test('non-cooperating writer wins safely; publication never force-overwrites it', async t => {
  const f = fixture(t); let concurrent;
  await assert.rejects(writePublication({ ...f.args, changes: [{ path: 'branch/abc/new.txt', content: 'new' }],
    beforeUpdate: async () => {
      fs.writeFileSync(path.join(f.source, 'concurrent.txt'), 'external');
      f.command(['add', 'concurrent.txt']); f.command(['commit', '-qm', 'External change']);
      concurrent = f.command(['rev-parse', 'HEAD']);
      f.command(['push', f.remote, 'HEAD:refs/heads/gh-pages']);
    } }));
  assert.equal(f.command(['--git-dir', f.remote, 'rev-parse', 'refs/heads/gh-pages']), concurrent);
  assert.equal(f.calls.filter(a => a[0] === 'push').length, 1);
});
