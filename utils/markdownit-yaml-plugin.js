import fs from 'fs';
import path from 'path';
import { load as loadYaml } from 'js-yaml';

function getValue(obj, p) {
  if (!p) return undefined;
  const parts = p.replace(/\[(\d+)\]/g, '.$1').split('.');
  let cur = obj;
  for (const part of parts) {
    if (cur == null) return undefined;
    cur = cur[part];
  }
  return cur;
}

function loadFile(filePath, baseDir) {
  const tryPaths = [];
  if (path.isAbsolute(filePath)) {
    tryPaths.push(filePath);
  } else {
    tryPaths.push(path.resolve(process.cwd(), filePath));
    tryPaths.push(path.resolve(process.cwd(), baseDir || './public/files', filePath));
  }

  for (const p of tryPaths) {
    try {
      const content = fs.readFileSync(p, 'utf8');
      return loadYaml(content);
    } catch (err) {
      // try next
    }
  }
  return undefined;
}

export default function markdownItYamlEmbed(md, opts = {}) {
  const baseDir = opts.baseDir || './public/files';
  const pattern = /\{\{yaml:([^:}]+):([^}]+)\}\}/g;
  function replaceInText(text) {
    if (!text) return text;
    return text.replace(pattern, (_, fileRaw, pathRaw) => {
      const file = fileRaw.trim();
      const pathStr = pathRaw.trim();
      const data = loadFile(file, baseDir);
      let val = data ? getValue(data, pathStr) : undefined;
      if (val === undefined) return '';
      if (typeof val === 'object') {
        try { return JSON.stringify(val); } catch (e) { return String(val); }
      }
      return String(val);
    });
  }

  md.core.ruler.push('yaml_embed', function (state) {
    for (const token of state.tokens) {
      // Handle fenced code blocks (```)
      if (token.type === 'fence' && token.content) {
        token.content = replaceInText(token.content);
        continue;
      }

      // Handle inline code tokens and html blocks
      if (token.type === 'inline' && token.children) {
        const children = [];
        for (const child of token.children) {
          if (child.type === 'text' || child.type === 'code_inline' || child.type === 'html_inline') {
            const t = new state.Token(child.type, child.tag || '', child.nesting || 0);
            t.attrs = child.attrs;
            t.markup = child.markup;
            t.content = replaceInText(child.content);
            children.push(t);
          } else {
            children.push(child);
          }
        }
        token.children = children;
      }
    }
  });
}
