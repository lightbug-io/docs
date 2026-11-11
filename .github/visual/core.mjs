import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import { createHash } from 'node:crypto';

export const PROFILES = {
  desktop: { viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 },
  mobile: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true },
};
export function parseOptions(argv) {
  const options = { base: 'origin/main', head: 'HEAD', comparison: 'merge-base', profiles: 'desktop,mobile', routes: '', output: 'visual-report', color: 'light' };
  const allowed = new Set([...Object.keys(options), 'base-dir', 'head-dir', 'base-sha', 'head-sha', 'skip-build', 'help']);
  for (let i = 0; i < argv.length; i++) {
    const key = argv[i].replace(/^--/, '');
    if (!argv[i].startsWith('--') || !allowed.has(key)) throw new Error(`Unknown argument: ${argv[i]}`);
    if (['skip-build', 'help'].includes(key)) options[key] = true;
    else {
      if (i + 1 === argv.length || argv[i + 1].startsWith('--')) throw new Error(`Missing value for --${key}`);
      options[key] = argv[++i];
    }
  }
  if (!['merge-base', 'base-tip'].includes(options.comparison)) throw new Error('comparison must be merge-base or base-tip');
  if (!['light', 'dark'].includes(options.color)) throw new Error('color must be light or dark');
  options.profiles = [...new Set(options.profiles.split(',').filter(Boolean))];
  if (!options.profiles.length || options.profiles.some(p => !PROFILES[p])) throw new Error('profiles must be desktop, mobile, or desktop,mobile');
  options.routes = options.routes.split(',').map(r => r.trim()).filter(Boolean);
  for (const route of options.routes) {
    if (!route.startsWith('/') || /[?#\\\x00-\x20]/.test(route) || route.split('/').some(p => p === '..' || p === '.')) throw new Error(`Invalid route/prefix: ${route}`);
  }
  if (Boolean(options['base-dir']) !== Boolean(options['head-dir'])) throw new Error('Provide both --base-dir and --head-dir');
  if (options['skip-build'] && !options['base-dir']) throw new Error('--skip-build requires prebuilt --base-dir and --head-dir');
  for (const key of ['base-sha', 'head-sha']) if (options[key] && !/^[0-9a-f]{40}$/.test(options[key])) throw new Error(`Invalid --${key}`);
  return options;
}
export function selected(route, filters) {
  return !filters.length || filters.some(filter => filter.endsWith('/') ? route.startsWith(filter) : route === filter);
}
export async function discoverRoutes(directory) {
  const routes = new Map();
  async function visit(dir) {
    for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
      if (entry.isSymbolicLink()) throw new Error(`Symlink in build output: ${entry.name}`);
      const file = path.join(dir, entry.name);
      if (entry.isDirectory()) await visit(file);
      else if (entry.name.endsWith('.html')) {
        const relative = path.relative(directory, file).split(path.sep).join('/');
        if (relative === '404.html') continue;
        const route = '/' + (relative === 'index.html' ? '' : relative.replace(/\/index\.html$/, '/').replace(/\.html$/, ''));
        if (routes.has(route)) throw new Error(`Duplicate output route: ${route}`);
        routes.set(route, relative);
      }
    }
  }
  await visit(directory);
  if (!routes.size) throw new Error(`No rendered pages in ${directory}`);
  return routes;
}
export function imageName(route, profile, state = 'page') {
  return `${createHash('sha256').update(route).digest('hex').slice(0, 20)}-${profile}-${state}`;
}
export const escapeHtml = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2', '.woff': 'font/woff', '.wasm': 'application/wasm', '.yaml': 'text/yaml' };
export async function serve(directory, base = '/docs/visual/') {
  const root = await fs.realpath(directory);
  const server = http.createServer(async (req, res) => {
    try {
      const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
      if (!pathname.startsWith(base) || /[\\\x00]/.test(pathname)) { res.writeHead(404).end(); return; }
      const requested = path.resolve(root, pathname.slice(base.length));
      if (requested !== root && !requested.startsWith(root + path.sep)) { res.writeHead(404).end(); return; }
      const candidates = pathname.endsWith('/') ? [path.join(requested, 'index.html')] : [requested, requested + '.html', path.join(requested, 'index.html')];
      for (const candidate of candidates) {
        try {
          const real = await fs.realpath(candidate);
          if (!real.startsWith(root + path.sep) || !(await fs.stat(real)).isFile()) continue;
          const bytes = await fs.readFile(real);
          res.writeHead(200, { 'Content-Type': mime[path.extname(real)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
          res.end(bytes); return;
        } catch (error) { if (!['ENOENT', 'ENOTDIR'].includes(error.code)) throw error; }
      }
      res.writeHead(404, { 'Content-Type': 'text/html' }).end('Not found');
    } catch { res.writeHead(400).end('Bad request'); }
  });
  await new Promise((resolve, reject) => { server.once('error', reject); server.listen(0, '127.0.0.1', resolve); });
  return { url: `http://127.0.0.1:${server.address().port}${base}`, close: () => new Promise(resolve => { server.close(resolve); server.closeAllConnections(); }) };
}
