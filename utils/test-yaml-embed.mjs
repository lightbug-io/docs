import MarkdownIt from 'markdown-it';
import yamlEmbed from './markdownit-yaml-plugin.js';

const md = new MarkdownIt();
md.use(yamlEmbed, { baseDir: './public/files' });

const src = 'Message description: {{yaml:protocol-v3.yaml:messages.11.description}}';
console.log('Rendering:', src);
console.log(md.render(src));
