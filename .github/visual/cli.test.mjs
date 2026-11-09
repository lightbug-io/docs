import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const cli = path.join(path.dirname(fileURLToPath(import.meta.url)), 'cli.mjs');
// No browser is launched: an intentionally missing executable stops after builds.
// Fake npm produces tiny rendered output, exercising git/worktree orchestration.
test('committed revisions build in isolated worktrees and clean up on capture failure', { skip: process.platform === 'win32' }, async t => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'visual-cli-test-'));
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  const repo = path.join(root, 'repo'), bin = path.join(root, 'bin');
  await fs.mkdir(repo); await fs.mkdir(bin);
  const git = (...args) => { const r = spawnSync('git', args, { cwd: repo, encoding: 'utf8' }); assert.equal(r.status, 0, r.stderr); return r.stdout.trim(); };
  git('init', '-b', 'main'); git('config', 'user.email', 'test@example.invalid'); git('config', 'user.name', 'Visual Test');
  await fs.writeFile(path.join(repo, 'version'), 'base'); git('add', 'version'); git('commit', '-m', 'base'); const base = git('rev-parse', 'HEAD');
  git('switch', '-c', 'feature'); await fs.writeFile(path.join(repo, 'version'), 'head'); git('commit', '-am', 'head'); const head = git('rev-parse', 'HEAD');
  await fs.writeFile(path.join(repo, 'version'), 'dirty user content');
  const npm = `#!${process.execPath}\nconst fs=require('node:fs');if(process.argv[2]==='run'){if(process.env.PREVIEW_BASE!=='/docs/visual/')process.exit(9);fs.mkdirSync('.vitepress/dist',{recursive:true});fs.writeFileSync('.vitepress/dist/index.html',fs.readFileSync('version'));}\n`;
  await fs.writeFile(path.join(bin, 'npm'), npm, { mode: 0o755 });
  const result = spawnSync(process.execPath, [cli, '--base', 'main', '--head', 'HEAD', '--output', path.join(root, 'report')], { cwd: repo, encoding: 'utf8', timeout: 30000, env: { ...process.env, PATH: bin + path.delimiter + process.env.PATH, VISUAL_CHROMIUM_PATH: path.join(root, 'missing-browser') } });
  assert.equal(result.status, 1, result.stderr);
  const report = JSON.parse(await fs.readFile(path.join(root, 'report/summary.json')));
  assert.equal(report.baseSha, base); assert.equal(report.headSha, head); assert.equal(report.status, 'failed');
  assert.ok(report.errors.some(e => /executable|browser|launch/i.test(e)), report.errors.join('\n'));
  assert.equal(git('rev-parse', 'HEAD'), head); assert.equal(git('branch', '--show-current'), 'feature');
  assert.equal(await fs.readFile(path.join(repo, 'version'), 'utf8'), 'dirty user content');
  assert.equal(git('worktree', 'list', '--porcelain').split('\n').filter(line => line.startsWith('worktree ')).length, 1);
});
