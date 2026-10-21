'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { parse } = require('parse5');

// Check rendered URLs, not source Markdown: VitePress already rebases ordinary
// Markdown links, imported assets and default-theme navigation automatically.
function findBasePathErrors(html, base) {
  const errors = [];
  const urlElements = new Set(['a', 'link', 'script', 'img', 'source', 'video', 'audio', 'iframe']);
  const urlAttributes = new Set(['href', 'src', 'poster']);
  function visit(node) {
    if (urlElements.has(node.tagName)) {
      for (const attribute of node.attrs) {
        if (!urlAttributes.has(attribute.name)) continue;
        const value = attribute.value.trim();
        if (!value.startsWith('/') || value.startsWith('//')) continue;
        if (!value.startsWith(base)) errors.push(`URL escapes base: ${value}`);
        else if (base !== '/' && value.startsWith(base + base.slice(1))) errors.push(`Base applied twice: ${value}`);
      }
    }
    for (const child of node.childNodes || []) visit(child);
  }
  // Parse only: no scripts execute, no resources load, and no filtered HTML is emitted.
  // Comment/script text stays text instead of being mistaken for rendered elements.
  visit(parse(html));
  return [...new Set(errors)];
}

function checkBuild(directory, base) {
  const errors = [];
  let pages = 0;
  function visit(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const file = path.join(dir, entry.name);
      if (entry.isDirectory()) visit(file);
      else if (entry.name.endsWith('.html')) {
        pages++;
        for (const error of findBasePathErrors(fs.readFileSync(file, 'utf8'), base)) {
          errors.push(`${path.relative(directory, file)}: ${error}`);
        }
      }
    }
  }
  visit(directory);
  if (!pages) throw new Error('No generated HTML pages found');
  const manifest = JSON.parse(fs.readFileSync(path.join(directory, 'site.webmanifest'), 'utf8'));
  for (const icon of manifest.icons) {
    const url = new URL(icon.src, 'https://docs.example' + base + 'site.webmanifest');
    if (url.origin === 'https://docs.example' && !url.pathname.startsWith(base)) {
      errors.push(`site.webmanifest: Icon escapes base: ${icon.src}`);
    }
  }
  if (errors.length) throw new Error(errors.join('\n'));
  console.log(`Checked ${pages} generated pages and manifest URLs under ${base}`);
}

if (require.main === module) checkBuild(process.argv[2] || '.vitepress/dist', process.env.PREVIEW_BASE || '/');
module.exports = { findBasePathErrors, checkBuild };
