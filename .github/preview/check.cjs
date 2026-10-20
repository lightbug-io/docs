const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

// Only called from the trusted default-branch checkout, never from PR content.
async function check({ github, context, core, expected }) {
  const repo = context.repo;
  const event = context.payload.workflow_run;
  const { data: run } = await github.rest.actions.getWorkflowRun({ ...repo, run_id: event.id });
  const { data: workflow } = await github.rest.actions.getWorkflow({ ...repo, workflow_id: 'preview-build.yml' });
  assert(run.event === 'pull_request' && run.status === 'completed' && run.conclusion === 'success', 'Build must succeed');
  assert(run.repository.full_name === `${repo.owner}/${repo.repo}` && run.workflow_id === workflow.id
    && run.path === '.github/workflows/preview-build.yml', 'Wrong build workflow');
  assert(Number.isSafeInteger(run.repository.id) && Number.isSafeInteger(run.head_repository?.id), 'Missing repository identity');
  assert(run.run_attempt === event.run_attempt && /^[0-9a-f]{40}$/.test(run.head_sha), 'Build attempt changed');
  // GitHub may omit pull_requests for forks. Resolve via GitHub's commit API,
  // never a PR number supplied inside the untrusted artifact.
  const candidates = run.pull_requests?.length ? run.pull_requests : await github.paginate(
    github.rest.repos.listPullRequestsAssociatedWithCommit, { ...repo, commit_sha: run.head_sha, per_page: 100 });
  const matching = [];
  for (const candidate of candidates) {
    const { data: pr } = await github.rest.pulls.get({ ...repo, pull_number: candidate.number });
    if (pr.state === 'open' && pr.base.ref === 'main' && pr.base.repo.full_name === run.repository.full_name
      && pr.head.sha === run.head_sha && pr.head.repo?.id === run.head_repository?.id) matching.push(pr);
  }
  assert(matching.length === 1, 'No unique, open PR at this exact build commit');
  const pr = matching[0];
  assert(Number.isSafeInteger(pr.number) && pr.number > 0, 'Invalid PR number');
  const artifacts = await github.paginate(github.rest.actions.listWorkflowRunArtifacts, { ...repo, run_id: run.id, per_page: 100 });
  const matches = artifacts.filter(a => a.name === `preview-static-${run.head_sha}-${run.run_attempt}` && !a.expired);
  assert(matches.length === 1, 'Expected one unexpired artifact for this attempt');
  const artifact = matches[0];
  assert(Number.isSafeInteger(artifact.id) && artifact.id > 0 && artifact.size_in_bytes <= 50 * 1024 * 1024 && artifact.workflow_run?.id === run.id
    && artifact.workflow_run.head_sha === pr.head.sha
    && artifact.workflow_run.head_repository_id === pr.head.repo.id, 'Artifact provenance/size mismatch');
  const environment = pr.head.repo.id === run.repository.id ? 'preview-internal' : 'preview-external';
  const result = { pr: String(pr.number), sha: pr.head.sha, artifact: String(artifact.id), environment };
  if (expected) assert.deepEqual(result, expected, 'PR or artifact changed while awaiting approval');
  for (const [key, value] of Object.entries(result)) core.setOutput(key, value);
  return result;
}

// The pinned download action handles ZIP extraction into a separate temp folder.
// Reject repository control files, links and oversized trees before git sees them.
function validate(directory) {
  let count = 0;
  let bytes = 0;
  function visit(parent) {
    for (const name of fs.readdirSync(parent)) {
      assert(!name.startsWith('.') && !/[\\:\x00-\x1f\x7f]/.test(name), 'Unsafe artifact filename');
      const file = path.join(parent, name);
      const stat = fs.lstatSync(file);
      assert(stat.isDirectory() || stat.isFile(), 'Only regular files/directories allowed');
      assert(++count <= 10000, 'Too many artifact entries');
      if (stat.isDirectory()) visit(file);
      else {
        bytes += stat.size;
        assert(stat.size <= 20 * 1024 * 1024 && bytes <= 100 * 1024 * 1024, 'Artifact too large');
      }
    }
  }
  visit(directory);
  assert(fs.lstatSync(path.join(directory, 'index.html')).isFile(), 'Missing index.html');
}
async function cleanup({ github, context }) {
  const { data: pr } = await github.rest.pulls.get({ ...context.repo, pull_number: context.payload.pull_request.number });
  assert(pr.state === 'closed', 'PR was reopened; do not remove its preview');
}
module.exports = { check, validate, cleanup };
