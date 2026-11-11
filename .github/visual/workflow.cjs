'use strict';

// This helper runs only from the trusted dispatch commit, never from a PR checkout.
const MARKER = '<!-- visual-diff-report:v1 -->';
const WORKFLOW = '.github/workflows/visual-diff.yml';
const SHA = /^[a-f0-9]{40}$/;
function check(condition, message) { if (!condition) throw new Error(message); }
function id(value) { check(Number.isSafeInteger(Number(value)) && Number(value) > 0 && /^\d+$/.test(String(value)), 'Invalid numeric ID'); return Number(value); }
function sha(value) { check(typeof value === 'string' && SHA.test(value), 'Invalid commit SHA'); return value; }
function repoName(value) { check(typeof value === 'string' && /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(value), 'Invalid repository'); return value; }
function dispatch(context) {
  check(context.eventName === 'workflow_dispatch' && context.ref === 'refs/heads/main', 'Dispatch must run on main');
  sha(context.sha); id(context.runId);
  check(repoName(`${context.repo.owner}/${context.repo.repo}`), 'Invalid context repository');
}
async function pull({ github, context, pr }) {
  const { data: repository } = await github.rest.repos.get(context.repo);
  check(repository.default_branch === 'main' && repository.full_name === `${context.repo.owner}/${context.repo.repo}`, 'Wrong default repository');
  id(repository.id);
  const { data: p } = await github.rest.pulls.get({ ...context.repo, pull_number: id(pr) });
  check(p.number === id(pr) && p.state === 'open' && !p.merged, 'PR is not open');
  check(p.base.ref === 'main' && p.base.repo.id === repository.id && p.base.repo.full_name === repository.full_name, 'Wrong PR base');
  check(p.head.repo && p.head.repo.owner && p.head.repo.full_name === `${p.head.repo.owner.login}/${p.head.repo.name}`, 'Invalid head repository identity');
  repoName(p.head.repo.full_name); id(p.head.repo.id); sha(p.head.sha); sha(p.base.sha);
  return { p, repository };
}
async function resolve({ github, context, core, inputs = context.payload.inputs }) {
  dispatch(context);
  const pr = id(inputs.pr);
  const { p, repository } = await pull({ github, context, pr });
  const { data: comparison } = await github.rest.repos.compareCommitsWithBasehead({
    ...context.repo, basehead: `${p.base.sha}...${p.head.repo.owner.login}:${p.head.sha}`,
  });
  const expected = { pr: String(pr), base: sha(comparison.merge_base_commit.sha), head: p.head.sha,
    repo: p.head.repo.full_name, repositoryId: String(repository.id), headRepositoryId: String(p.head.repo.id),
    run: String(id(context.runId)), attempt: String(id(process.env.GITHUB_RUN_ATTEMPT)), workflowSha: context.sha };
  for (const [key, value] of Object.entries(expected)) core.setOutput(key, value);
  return expected;
}
function artifactName(e) { return `visual-diff-pr-${id(e.pr)}-${sha(e.head)}-${id(e.attempt)}`; }
async function announce({ github, context, expected: e, captureResult, uploadResult }) {
  dispatch(context);
  id(e.pr); sha(e.base); sha(e.head); repoName(e.repo);
  check(id(e.run) === id(context.runId) && e.workflowSha === context.sha && id(e.attempt) === id(process.env.GITHUB_RUN_ATTEMPT), 'Dispatch binding mismatch');
  const { p, repository } = await pull({ github, context, pr: e.pr });
  check(p.head.sha === e.head && p.head.repo.full_name === e.repo && p.head.repo.id === id(e.headRepositoryId) && repository.id === id(e.repositoryId), 'PR head is stale or repository changed');
  const { data: run } = await github.rest.actions.getWorkflowRun({ ...context.repo, run_id: id(e.run) });
  const { data: workflow } = await github.rest.actions.getWorkflow({ ...context.repo, workflow_id: id(run.workflow_id) });
  check(workflow.path === WORKFLOW && id(workflow.id) === id(run.workflow_id), 'Wrong workflow');
  check(run.id === id(e.run) && run.run_attempt === id(e.attempt) && run.event === 'workflow_dispatch' && run.head_branch === 'main' && run.head_sha === e.workflowSha && run.repository.id === repository.id && run.head_repository.id === repository.id, 'Run metadata mismatch');
  const artifacts = await github.paginate(github.rest.actions.listWorkflowRunArtifacts, { ...context.repo, run_id: id(e.run), per_page: 100 });
  const matches = artifacts.filter(a => a.name === artifactName(e));
  check(matches.length <= 1, 'Ambiguous report artifact');
  const artifact = matches[0];
  if (artifact) {
    id(artifact.id);
    check(!artifact.expired && Number.isSafeInteger(artifact.size_in_bytes) && artifact.size_in_bytes > 0 && artifact.workflow_run && artifact.workflow_run.id === id(e.run) && artifact.workflow_run.head_sha === e.workflowSha && artifact.workflow_run.repository_id === repository.id && artifact.workflow_run.head_repository_id === repository.id, 'Artifact metadata mismatch');
  }
  check(['success', 'failure', 'cancelled', 'skipped'].includes(captureResult), 'Invalid capture status');
  check(['success', 'failure', 'cancelled', 'skipped', ''].includes(uploadResult), 'Invalid upload status');
  const origin = 'https://github.com';
  const runUrl = `${origin}/${repository.full_name}/actions/runs/${id(e.run)}/attempts/${id(e.attempt)}`;
  const report = artifact && uploadResult === 'success'
    ? `[Download report artifact](${origin}/${repository.full_name}/actions/runs/${id(e.run)}/artifacts/${id(artifact.id)}). Sign in to GitHub to download; retention is 7 days. Unzip and open report/index.html (or index.html at the archive root).`
    : 'No downloadable report is available: capture or artifact upload did not produce a verified report. See the run logs.';
  const body = `${MARKER}\n### Visual diff report\n\nBase: \`${e.base}\`\nHead: \`${e.head}\`\n\n[Run](${runUrl}): **${captureResult}**. Artifact upload: **${uploadResult || 'not run'}**.\n\n${report}\n\nReport only: this does not publish a live preview or gate merging. Differences require human review. Reports include PR-controlled content; treat downloaded HTML as untrusted.`;
  const comments = await github.paginate(github.rest.issues.listComments, { ...context.repo, issue_number: id(e.pr), per_page: 100 });
  const owned = comments.filter(c => c.user?.type === 'Bot' && c.user?.login === 'github-actions[bot]' && c.body?.startsWith(`${MARKER}\n`));
  check(owned.length <= 1, 'Ambiguous bot report comments');
  // Recheck after listing metadata/comments, immediately before the write.
  const { p: current } = await pull({ github, context, pr: e.pr });
  check(current.head.sha === e.head && current.head.repo.full_name === e.repo && current.head.repo.id === id(e.headRepositoryId), 'PR head changed before comment');
  if (owned.length) await github.rest.issues.updateComment({ ...context.repo, comment_id: id(owned[0].id), body });
  else await github.rest.issues.createComment({ ...context.repo, issue_number: id(e.pr), body });
  return body;
}
module.exports = { resolve, announce, artifactName };
