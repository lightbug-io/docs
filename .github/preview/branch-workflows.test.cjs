'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const yaml = require('js-yaml');
const read = name => fs.readFileSync(path.join(__dirname, '../workflows', name), 'utf8');
test('branch build stays read-only, branch-only and opt-in with pinned actions', () => {
  const text = read('branch-preview-build.yml'), workflow = yaml.load(text);
  assert.deepEqual(workflow.permissions, { contents: 'read' });
  assert(workflow.on.workflow_dispatch === null); assert(workflow.on.push);
  assert.match(workflow.jobs.build.if, /github.ref_type == 'branch'/);
  assert.match(workflow.jobs.build.if, /\[ci-preview\]/);
  assert.doesNotMatch(text, /secrets\.|contents: write|actions\/cache/);
  assert.match(text, /persist-credentials: false/);
  assert.match(text, /ref: \$\{\{ github.sha \}\}/);
  for (const step of workflow.jobs.build.steps.filter(s => s.uses)) assert.match(step.uses, /@[a-f0-9]{40}$/);
});
test('all Pages writers share lock and age cleanup while S3 deployment remains separate', () => {
  for (const name of ['preview-publish.yml', 'branch-preview-publish.yml']) {
    const workflow = yaml.load(read(name));
    for (const job of Object.values(workflow.jobs).filter(j => j.permissions?.['pages'] === 'write')) {
      assert.deepEqual(job.concurrency, { group: 'pages-preview-publisher', 'cancel-in-progress': false, queue: 'max' });
      assert.match(JSON.stringify(job.steps), /branch-pages.cjs/);
      assert.match(job.if || workflow.jobs.resolve.if, /github.ref == 'refs\/heads\/main'/);
      assert.match(JSON.stringify(job.steps), /ref.*github.sha/);
    }
  }
  for (const name of ['deploy-next.yml', 'deploy-production.yml']) {
    assert.match(read(name), /s3-sync-action/); assert.doesNotMatch(read(name), /gh-pages|branch-pages/);
  }
});
test('manual cleanup uses original workflow creation time, no input interpolation into executable script', () => {
  const w = yaml.load(read('branch-preview-publish.yml'));
  const cleanup = w.jobs.cleanup;
  assert.match(JSON.stringify(cleanup.steps), /run.created_at/);
  for (const job of Object.values(w.jobs)) for (const step of job.steps) {
    assert.doesNotMatch(step.with?.script || '', /\$\{\{/);
    assert.doesNotMatch(step.run || '', /\$\{\{/);
  }
});
