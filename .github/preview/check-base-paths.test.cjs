const assert = require('node:assert/strict');
const { test } = require('node:test');
const { findBasePathErrors } = require('./check-base-paths.cjs');

for (const base of ['/', '/docs/pr/99/']) {
  test(`allows internal URLs under ${base} and leaves other URL forms alone`, () => {
    const html = `<a href="${base}devices/zero/?view=full#details">Device</a>
      <img src="${base}images/zero.png"><link href="${base}site.webmanifest">
      <script src="${base}assets/app.js"></script><a href="#section">Hash</a>
      <a href="?q=1">Query</a><a href="../guide">Relative</a>
      <a href="https://external.example/devices">External</a><img src="//cdn.example/a.png">
      <img src="data:image/png;base64,abc"><a href="mailto:help@example.com">Email</a>
      <a href="blob:https://docs.example/id">Download</a>`;
    assert.deepEqual(findBasePathErrors(html, base), []);
  });
}
test('rejects escaped links, images, downloads and head assets in previews', () => {
  assert.deepEqual(findBasePathErrors('<a href="/devices/zero/"><img src="/images/device.png"><a href="/files/spec.yaml"><link href="/favicon.png">', '/docs/pr/99/'), [
    'URL escapes base: /devices/zero/', 'URL escapes base: /images/device.png',
    'URL escapes base: /files/spec.yaml', 'URL escapes base: /favicon.png',
  ]);
});
test('rejects double-prefixing', () => {
  assert.deepEqual(findBasePathErrors('<a href="/docs/pr/99/docs/pr/99/devices">', '/docs/pr/99/'), [
    'Base applied twice: /docs/pr/99/docs/pr/99/devices',
  ]);
});

test('ignores API examples, non-URL attributes, comments and script data', () => {
  const html = `<code>GET /devices</code><code>&lt;a href="/example"&gt;</code>
    <a data-href="/example" href="#section">Example</a>
    <!-- <img src="/not-rendered.png"> -->
    <script>const example = '<a href="/api/example">Example</a>';</script>`;
  assert.deepEqual(findBasePathErrors(html, '/docs/pr/99/'), []);
});
