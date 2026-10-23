'use strict';
const assert = require('node:assert/strict');
const { createHash } = require('node:crypto');
const WORKFLOW = '.github/workflows/branch-preview-build.yml';
function branchId(branch) {
  assert(typeof branch === 'string' && branch.length > 0 && branch.length <= 200
    && !/[\x00-\x20\x7f~^:?*\[\\]/.test(branch) && !branch.includes('..')
    && !branch.includes('@{') && !branch.startsWith('/') && !branch.endsWith('/')
    && branch.split('/').every(p => p && !p.startsWith('.') && !p.endsWith('.') && !p.endsWith('.lock')),
  'Invalid branch name');
  assert(!['main', 'production', 'gh-pages'].includes(branch), 'Reserved branch');
  return createHash('sha256').update(`refs/heads/${branch}`).digest('hex');
}
async function check({ github, context, core, expected }) {
  const repo = context.repo;
  const event = context.payload.workflow_run;
  const { data: run } = await github.rest.actions.getWorkflowRun({ ...repo, run_id: event.id });
  const { data: workflow } = await github.rest.actions.getWorkflow({ ...repo, workflow_id: 'branch-preview-build.yml' });
  assert(['push', 'workflow_dispatch'].includes(run.event) && run.status === 'completed' && run.conclusion === 'success', 'Wrong build event or result');
  assert(run.repository.full_name === `${repo.owner}/${repo.repo}` && Number.isSafeInteger(run.repository.id)
    && run.head_repository?.id === run.repository.id, 'Build must belong to this repository');
  assert(run.workflow_id === workflow.id && run.path === WORKFLOW && run.run_attempt === event.run_attempt,
    'Wrong workflow or changed attempt');
  assert(/^[0-9a-f]{40}$/.test(run.head_sha), 'Invalid commit');
  const branch = run.head_branch;
  const id = branchId(branch);
  const { data: ref } = await github.rest.git.getRef({ ...repo, ref: `heads/${branch}` });
  assert(ref.ref === `refs/heads/${branch}` && ref.object.type === 'commit' && ref.object.sha === run.head_sha,
    'Branch moved or disappeared');
  // A push workflow is loaded from the pushed branch. Only our exact trusted
  // build definition may cross into this privileged workflow, not a forged run.
  const files = await Promise.all([run.head_sha, context.sha].map(ref =>
    github.rest.repos.getContent({ ...repo, path: WORKFLOW, ref })));
  assert(files.every(f => f.data.type === 'file') && files[0].data.sha === files[1].data.sha,
    'Branch build workflow differs from trusted main; update the branch first');
  for (const actor of new Set([run.actor?.login, run.triggering_actor?.login])) {
    assert(actor, 'Missing build actor');
    const { data } = await github.rest.repos.getCollaboratorPermissionLevel({ ...repo, username: actor });
    assert(['write', 'maintain', 'admin'].includes(data.permission), 'Build actor needs current repository write access');
  }
  if (run.event === 'push') {
    const { data: commit } = await github.rest.repos.getCommit({ ...repo, ref: run.head_sha });
    assert(commit.sha === run.head_sha && commit.commit.message.includes('[ci-preview]'), 'Push head commit must opt in with [ci-preview]');
  }
  const artifacts = await github.paginate(github.rest.actions.listWorkflowRunArtifacts, { ...repo, run_id: run.id, per_page: 100 });
  const matches = artifacts.filter(a => a.name === `branch-preview-${run.head_sha}-${run.run_attempt}` && !a.expired);
  assert(matches.length === 1, 'Expected one branch artifact');
  const artifact = matches[0];
  assert(Number.isSafeInteger(artifact.id) && artifact.id > 0 && artifact.size_in_bytes <= 50 * 1024 * 1024
    && artifact.workflow_run?.id === run.id && artifact.workflow_run.head_sha === run.head_sha
    && artifact.workflow_run.head_repository_id === run.repository.id, 'Artifact provenance/size mismatch');
  assert(Number.isSafeInteger(run.id) && run.id > 0 && Number.isFinite(Date.parse(run.created_at)), 'Invalid run identity/time');
  const result = { branch, id, sha: run.head_sha, artifact: String(artifact.id), runId: String(run.id), createdAt: run.created_at };
  if (expected) assert.deepEqual(result, expected, 'Branch build changed while awaiting publication');
  for (const [key, value] of Object.entries(result)) core.setOutput(key, value);
  return result;
}
module.exports = { branchId, check };
