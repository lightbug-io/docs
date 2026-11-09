// Explicit browser integration check. Not part of unit tests because it needs Chromium.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const root = await fs.mkdtemp(path.join(os.tmpdir(), 'visual-smoke-'));
const tool = path.dirname(fileURLToPath(import.meta.url));
const page = text => `<!doctype html><html><head><meta name="viewport" content="width=device-width"><style>body{font:20px sans-serif;background:white}.VPNavScreen,.VPSidebar{display:none}.open{display:block;background:#ddeeff;padding:20px}@media(min-width:700px){button{display:none}}</style></head><body><button class="VPNavBarHamburger" aria-expanded="false" onclick="this.setAttribute('aria-expanded',this.getAttribute('aria-expanded')!=='true');document.querySelector('.VPNavScreen').classList.toggle('open')">Menu</button><div class="VPNavScreen">Top navigation</div><div class="VPLocalNav"><button class="menu" onclick="document.querySelector('.VPSidebar').classList.toggle('open')">Sidebar</button></div><aside class="VPSidebar">Device sidebar</aside><h1>${text}</h1><p>Stable text</p></body></html>`;
try {
  for (const side of ['base', 'head']) {
    const dir = path.join(root, side, '.vitepress/dist'); await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, 'index.html'), page('Unchanged'));
    await fs.writeFile(path.join(dir, 'changed.html'), page(side === 'base' ? 'Before' : 'After'));
    await fs.writeFile(path.join(dir, side === 'base' ? 'removed.html' : 'added.html'), '<h1>Page without navigation</h1>');
  }
  const invoke = (name, extra = []) => spawnSync(process.execPath, [path.join(tool, 'cli.mjs'), '--base-dir', path.join(root, 'base'), '--head-dir', path.join(root, 'head'), '--skip-build', '--base-sha', 'a'.repeat(40), '--head-sha', 'b'.repeat(40), '--output', path.join(root, name), ...extra], { env: process.env, encoding: 'utf8', timeout: 120000 });
  const result = invoke('report'); console.log(result.stdout); console.error(result.stderr); assert.equal(result.status, 0, 'visual differences must not fail');
  const report = JSON.parse(await fs.readFile(path.join(root, 'report/summary.json')));
  assert.ok(report.counts.changed > 0); assert.ok(report.counts.unchanged > 0); assert.ok(report.counts.added > 0); assert.ok(report.counts.removed > 0); assert.equal(report.counts.error, 0);
  assert.ok(report.pages.some(p => p.state === 'sidebar' && p.head)); assert.ok(report.pages.some(p => p.state === 'navigation' && p.head));
  await fs.writeFile(path.join(root, 'head/.vitepress/dist/broken.html'), '<h1>Broken image</h1><img src="/docs/visual/missing.png">');
  const broken = invoke('broken', ['--routes', '/broken', '--profiles', 'desktop']); assert.equal(broken.status, 1, 'broken resources must fail');
  const failure = JSON.parse(await fs.readFile(path.join(root, 'broken/summary.json'))); assert.equal(failure.counts.error, 1); assert.ok(failure.pages[0].errors.join(' ').includes('Broken images'));
  const overwrite = invoke('report'); assert.notEqual(overwrite.status, 0, 'must refuse to overwrite reports');
  console.log('Browser smoke passed: paired/added/removed/unchanged, desktop/mobile/navigation/sidebar, report-only exit, resource failure, overwrite refusal.');
  console.log(`Smoke artifacts: ${root}`);
} catch (error) { console.error(`Retained smoke artifacts: ${root}`); throw error; }
