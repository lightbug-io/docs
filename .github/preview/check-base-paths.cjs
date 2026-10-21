'use strict';

const fs = require('node:fs');
const path = require('node:path');

// Check rendered URLs, not source Markdown: VitePress already rebases ordinary
// Markdown links, imported assets and default-theme navigation automatically.
function findBasePathErrors(html, base) {
  const errors = [];
  const markup = html.replace(/<!--[\s\S]*?-->/g, '')
    .replace(/(<script\b[^>]*>)[\s\S]*?<\/script\s*>/gi, '$1</script>');
  const tags = markup.match(/<(?:a|link|script|img|source|video|audio|iframe)\b[^>]*>/gi) || [];
  for (const tag of tags) {
    for (const [, , value] of tag.matchAll(/\s(?:href|src|poster)\s*=\s*(["'])(.*?)\1/gi)) {
      if (!value.startsWith('/') || value.startsWith('//')) continue;
      if (!value.startsWith(base)) errors.push(`URL escapes base: ${value}`);
      else if (base !== '/' && value.startsWith(base + base.slice(1))) errors.push(`Base applied twice: ${value}`);
    }
  }
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
