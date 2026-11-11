import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from '@playwright/test';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import { PROFILES, imageName, selected, serve } from './core.mjs';

// Existing public documentation asset hosts only. Do not permit arbitrary page
// requests, analytics, credentials, API calls or third-party frames.
export const ASSET_ORIGINS = new Set(['https://upload.r2.lb.chasm.cloud', 'https://docs.lightbug.io', 'https://lightbug.io', 'https://upload.wikimedia.org']);
export function comparePng(before, after) {
  const a = PNG.sync.read(before), b = PNG.sync.read(after);
  const width = Math.max(a.width, b.width), height = Math.max(a.height, b.height);
  if (width * height > 60_000_000) throw new Error('Comparison exceeds 60 million pixels');
  const pad = source => {
    const target = new PNG({ width, height }); target.data.fill(255);
    PNG.bitblt(source, target, 0, 0, source.width, source.height, 0, 0); return target;
  };
  const diff = new PNG({ width, height });
  const diffPixels = pixelmatch(pad(a).data, pad(b).data, diff.data, width, height, { threshold: 0.2 });
  const sizeChanged = a.width !== b.width || a.height !== b.height;
  return { diff: PNG.sync.write(diff), diffPixels, diffRatio: diffPixels / (width * height), sizeChanged, baseSize: [a.width, a.height], headSize: [b.width, b.height] };
}
async function ready(page) {
  await page.locator('body').waitFor();
  await page.evaluate(async () => {
    await document.fonts.ready;
    // Load lazy images throughout long documentation, including Vuetify images.
    for (let y = 0; y < document.documentElement.scrollHeight; y += 800) {
      if (y > 30000) throw new Error('Page exceeds 30,000 CSS pixels; no truncated capture was accepted');
      window.scrollTo(0, y); await new Promise(resolve => setTimeout(resolve, 40));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForFunction(() => Array.from(document.images).every(image => image.complete), undefined, { timeout: 15000 });
  await page.evaluate(async () => { await document.fonts.ready; });
  const broken = await page.evaluate(() => Array.from(document.images).filter(image => image.currentSrc && !image.naturalWidth).map(image => image.currentSrc));
  if (broken.length) throw new Error(`Broken images: ${broken.slice(0, 5).join(', ')}`);
  await page.mouse.move(-1, -1);
}
async function stableScreenshot(page) {
  let previous;
  for (let attempt = 0; attempt < 5; attempt++) {
    const current = await page.screenshot({ fullPage: true, animations: 'disabled', caret: 'hide', scale: 'css', timeout: 15000 });
    if (previous?.equals(current)) return current;
    previous = current; await page.waitForTimeout(200);
  }
  throw new Error('Page did not produce two consecutive stable screenshots');
}
export async function capture({ baseDist, headDist, baseRoutes, headRoutes, options, output, report, onProgress = () => {} }) {
  const routes = [...new Set([...baseRoutes.keys(), ...headRoutes.keys()])].filter(r => selected(r, options.routes)).sort();
  if (!routes.length) throw new Error('No built routes match the requested scope');
  if (routes.length > 2000) throw new Error('More than 2,000 routes; narrow --routes explicitly');
  report.routeCount = routes.length;
  const baseServer = await serve(baseDist), headServer = await serve(headDist);
  let browser;
  const external = new Map();
  try {
    browser = await chromium.launch({ headless: true, ...(process.env.VISUAL_CHROMIUM_PATH ? { executablePath: process.env.VISUAL_CHROMIUM_PATH } : {}) });
    report.browserVersion = browser.version();
    for (const route of routes) for (const profile of options.profiles) {
      const states = profile === 'mobile' ? ['page', 'navigation', 'sidebar'] : ['page'];
      const captures = { base: {}, head: {} };
      for (const side of ['base', 'head']) {
        if (!(side === 'base' ? baseRoutes : headRoutes).has(route)) continue;
        const server = side === 'base' ? baseServer : headServer;
        const origin = new URL(server.url).origin;
        const context = await browser.newContext({ ...PROFILES[profile], colorScheme: options.color, locale: 'en-GB', timezoneId: 'UTC', reducedMotion: 'reduce', serviceWorkers: 'block' });
        const errors = new Set();
        await context.route('**/*', async requestRoute => {
          const request = requestRoute.request(), url = new URL(request.url());
          if (url.origin === origin || ['data:', 'blob:'].includes(url.protocol)) { await requestRoute.continue(); return; }
          if (!ASSET_ORIGINS.has(url.origin) || !['image', 'font'].includes(request.resourceType())) { await requestRoute.abort(); return; }
          try {
            if (!external.has(request.url())) external.set(request.url(), (async () => {
              let current = request.url(), response;
              for (let hop = 0; hop < 4; hop++) {
                if (!ASSET_ORIGINS.has(new URL(current).origin)) throw new Error('Asset redirected to an unapproved origin');
                response = await requestRoute.fetch({ url: current, maxRedirects: 0, timeout: 15000 });
                if (response.status() < 300 || response.status() >= 400) break;
                const location = response.headers().location;
                if (!location) break;
                current = new URL(location, current).href;
              }
              if (!response.ok()) throw new Error(`HTTP ${response.status()}`);
              const body = await response.body();
              if (body.length > 20 * 1024 * 1024) throw new Error('Asset exceeds 20 MiB');
              return { body, contentType: response.headers()['content-type'] || 'application/octet-stream' };
            })());
            await requestRoute.fulfill({ status: 200, ...(await external.get(request.url())) });
          } catch (error) { errors.add(`External asset failed: ${url.href}: ${error.message}`); await requestRoute.abort(); }
        });
        const page = await context.newPage();
        page.on('pageerror', error => errors.add(`Browser error: ${error.message}`));
        page.on('response', response => { if (response.url().startsWith(origin) && response.status() >= 400) errors.add(`HTTP ${response.status()}: ${response.url().replace(origin, '')}`); });
        page.on('requestfailed', request => { if (request.url().startsWith(origin)) errors.add(`Resource failed: ${request.url().replace(origin, '')}`); });
        try {
          const response = await page.goto(server.url + route.slice(1), { waitUntil: 'load', timeout: 30000 });
          if (response?.status() !== 200) throw new Error(`Page returned HTTP ${response?.status()}`);
          await page.waitForLoadState('networkidle', { timeout: 15000 });
          await ready(page);
          for (const state of states) {
            try {
              if (state === 'navigation') {
                const menu = page.locator('.VPNavBarHamburger');
                if (!(await menu.isVisible())) { captures[side][state] = { skipped: true }; continue; }
                await menu.click();
                await page.locator('.VPNavScreen').waitFor({ state: 'visible' });
                // On docs pages the local navigation exposes the sidebar. Capture
                // it separately where available, rather than pretending mobile
                // page screenshots cover the desktop sidebar.
              }
              if (state === 'sidebar') {
                const hamburger = page.locator('.VPNavBarHamburger');
                if (await hamburger.count() && await hamburger.getAttribute('aria-expanded') === 'true') await hamburger.click();
                const menu = page.locator('.VPLocalNav .menu');
                if (!(await menu.isVisible())) { captures[side][state] = { skipped: true }; continue; }
                await menu.click();
                await page.locator('.VPSidebar.open').waitFor({ state: 'visible' });
              }
              const bytes = await stableScreenshot(page);
              const filename = `images/${imageName(route, profile, state)}-${side}.png`;
              await fs.writeFile(path.join(output, filename), bytes);
              captures[side][state] = { bytes, filename, errors: [...errors] };
            } catch (error) { captures[side][state] = { errors: [...errors, error.message] }; }
          }
        } catch (error) {
          for (const state of states) captures[side][state] = { errors: [...errors, error.message] };
        } finally { await context.close(); }
      }
      for (const state of states) {
        const a = captures.base[state], b = captures.head[state];
        if ([a, b].filter(Boolean).every(value => value.skipped)) continue;
        const item = { route, profile, state, errors: [...(a?.errors || []).map(e => 'Before: ' + e), ...(b?.errors || []).map(e => 'After: ' + e)] };
        if (a?.filename) item.base = a.filename;
        if (b?.filename) item.head = b.filename;
        if (a?.bytes && b?.bytes) {
          const { diff, ...metrics } = comparePng(a.bytes, b.bytes);
          Object.assign(item, metrics);
          item.status = metrics.diffPixels || metrics.sizeChanged ? 'changed' : 'unchanged';
          if (item.status === 'changed') { item.diff = `images/${imageName(route, profile, state)}-diff.png`; await fs.writeFile(path.join(output, item.diff), diff); }
        } else item.status = !baseRoutes.has(route) ? 'added' : !headRoutes.has(route) ? 'removed' : 'changed';
        if (item.errors.length || (!item.base && !item.head)) item.status = 'error';
        report.pages.push(item);
      }
      await onProgress(`${route} (${profile})`);
    }
  } finally {
    report.externalAssets = [...external.keys()];
    await browser?.close(); await Promise.all([baseServer.close(), headServer.close()]);
  }
}
