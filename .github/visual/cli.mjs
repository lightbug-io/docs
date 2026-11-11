#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { spawn } from 'node:child_process';
import { parseOptions, discoverRoutes } from './core.mjs';
import { writeReport } from './report.mjs';

const help = `Usage: npm run visual:diff -- [options]
  --base origin/main        Base ref (default origin/main)
  --head HEAD               Head ref (committed changes only)
  --comparison merge-base   merge-base (default) or base-tip
  --routes /guides/,/devices Exact route or trailing-slash prefix, comma-separated
  --profiles desktop,mobile Desktop, mobile, or both (default both)
  --color light             light or dark
  --output visual-report    New report directory (must not exist)
  --base-dir DIR --head-dir DIR  Existing isolated source checkouts (CI)
  --base-sha SHA --head-sha SHA  Exact checkout SHAs (required with build dirs)
  --skip-build              Compare existing .vitepress/dist in supplied dirs

Setup: npm ci --prefix .github/visual
       npm exec --prefix .github/visual -- playwright install chromium
The command builds both revisions sequentially. It never checks out your working
branch. Only run trusted revisions locally: npm install/build execute their code.
Visual changes exit 0; build/capture errors exit 1. Artifacts are review aids.
`;
function run(command, args, cwd, log, extraEnv = {}) {
  return new Promise((resolve, reject) => {
    // Do not pass CI tokens, deployment keys or unrelated env into PR scripts.
    // This is hygiene, not a sandbox. Use isolated read-only CI for untrusted PRs.
    const allowed = ['PATH', 'HOME', 'TMPDIR', 'TMP', 'TEMP', 'SystemRoot', 'COMSPEC', 'PATHEXT', 'HTTP_PROXY', 'HTTPS_PROXY', 'NO_PROXY', 'http_proxy', 'https_proxy', 'no_proxy', 'npm_config_cache'];
    const env = Object.fromEntries(allowed.filter(k => process.env[k] !== undefined).map(k => [k, process.env[k]]));
    const child = spawn(command, args, { cwd, env: { ...env, ...extraEnv }, shell: process.platform === 'win32' && command === 'npm.cmd', detached: process.platform !== 'win32', stdio: ['ignore', 'pipe', 'pipe'] });
    let stdout = '', timedOut = false;
    const kill = signal => {
      try { if (process.platform !== 'win32' && child.pid) process.kill(-child.pid, signal); else child.kill(signal); }
      catch (error) { if (error.code !== 'ESRCH') throw error; }
    };
    const timer = setTimeout(() => { timedOut = true; kill('SIGTERM'); }, 15 * 60 * 1000);
    const killTimer = setTimeout(() => kill('SIGKILL'), 15 * 60 * 1000 + 5000);
    child.stdout.on('data', data => { if (log) process.stdout.write(data); else { stdout += data; if (stdout.length > 1024 * 1024) child.kill('SIGTERM'); } });
    child.stderr.on('data', data => { if (log) process.stderr.write(data); });
    child.once('error', error => { clearTimeout(timer); clearTimeout(killTimer); reject(error); });
    child.once('close', code => { clearTimeout(timer); clearTimeout(killTimer); if (code || timedOut) reject(new Error(`${command} ${args.join(' ')} failed (${timedOut ? 'timeout' : code})`)); else resolve(stdout.trim()); });
  });
}
const options = parseOptions(process.argv.slice(2));
if (options.help) { console.log(help); process.exit(0); }
const output = path.resolve(options.output);
// Refuse to delete or overwrite a user's existing files, even on a rerun.
await fs.mkdir(output, { recursive: false });
await fs.mkdir(path.join(output, 'images'));
const report = { generatedAt: new Date().toISOString(), color: options.color, scope: options.routes.length ? options.routes.join(', ') : 'all rendered routes', comparison: options.comparison, status: 'incomplete', pages: [], errors: [] };
await writeReport(output, report);
let temp, repo, worktrees = [];
try {
  let baseDir, headDir;
  if (options['base-dir']) {
    baseDir = path.resolve(options['base-dir']); headDir = path.resolve(options['head-dir']);
    report.baseSha = options['base-sha']; report.headSha = options['head-sha'];
    if (!options['skip-build']) {
      if (!report.baseSha || !report.headSha) throw new Error('--base-sha and --head-sha required with source directories');
      for (const [dir, expected] of [[baseDir, report.baseSha], [headDir, report.headSha]]) {
        if (await run('git', ['rev-parse', 'HEAD'], dir) !== expected) throw new Error(`Checkout does not match expected commit: ${dir}`);
        if (await run('git', ['status', '--porcelain', '--untracked-files=no'], dir)) throw new Error(`Checkout has tracked changes: ${dir}`);
      }
    }
  } else {
    repo = await run('git', ['rev-parse', '--show-toplevel'], process.cwd());
    const head = await run('git', ['rev-parse', '--verify', '--end-of-options', `${options.head}^{commit}`], repo);
    const requestedBase = await run('git', ['rev-parse', '--verify', '--end-of-options', `${options.base}^{commit}`], repo);
    report.headSha = head;
    report.baseSha = options.comparison === 'merge-base' ? await run('git', ['merge-base', requestedBase, head], repo) : requestedBase;
    temp = await fs.mkdtemp(path.join(os.tmpdir(), 'docs-visual-'));
    [baseDir, headDir] = ['base', 'head'].map(name => path.join(temp, name));
    for (const [dir, sha] of [[baseDir, report.baseSha], [headDir, head]]) {
      await run('git', ['worktree', 'add', '--detach', dir, sha], repo, true); worktrees.push(dir);
      await run('git', ['submodule', 'update', '--init', '--recursive'], dir, true);
    }
  }
  if (baseDir === headDir) throw new Error('Base and head directories must be distinct');
  for (const dir of [baseDir, headDir]) if (output === dir || dir.startsWith(output + path.sep) || output.startsWith(dir + path.sep)) throw new Error('Report output must be separate from the build directories');
  if (!options['skip-build']) for (const dir of [baseDir, headDir]) {
    console.log(`Building ${dir}`);
    await run(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['ci'], dir, true);
    await run(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['run', 'build'], dir, true, { DEPLOYMENT_NAME: 'Preview', PREVIEW_BASE: '/docs/visual/', PUBLIC_GOOGLE_ANALYTICS: '' });
  }
  const [baseDist, headDist] = [baseDir, headDir].map(dir => path.join(dir, '.vitepress', 'dist'));
  const [baseRoutes, headRoutes] = await Promise.all([discoverRoutes(baseDist), discoverRoutes(headDist)]);
  const { capture } = await import('./capture.mjs');
  await capture({ baseDist, headDist, baseRoutes, headRoutes, options, output, report, onProgress: async message => { console.log(`Captured ${message}`); await writeReport(output, report); } });
} catch (error) {
  report.errors.push(error.message);
  console.error(error.stack);
} finally {
  for (const dir of worktrees) {
    try { await run('git', ['worktree', 'remove', '--force', dir], repo); }
    catch (error) { report.errors.push(`Cleanup: ${error.message}. Temporary worktree remains at ${dir}`); }
  }
  if (temp && !report.errors.some(e => e.startsWith('Cleanup:'))) await fs.rm(temp, { recursive: true, force: true });
  report.status = report.errors.length || report.pages.some(p => p.status === 'error') ? 'failed' : 'complete';
  await writeReport(output, report);
  console.log(`Report: ${path.join(output, 'index.html')}`);
}
process.exitCode = report.errors.length || report.pages.some(p => p.status === 'error') ? 1 : 0;
