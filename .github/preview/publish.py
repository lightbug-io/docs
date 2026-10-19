"""Trusted Pages assembler. Never import, check out or execute artifact content."""
import io
import json
import os
from pathlib import Path, PurePosixPath
import re
import stat
import sys
import urllib.error
import urllib.request
import zipfile

MAX_ZIP = 50 * 1024 * 1024
MAX_SITE = 100 * 1024 * 1024
MAX_FILES = 10000
REPO = os.environ.get('GITHUB_REPOSITORY', 'lightbug-io/docs')
API = 'https://api.github.com/repos/' + REPO
WORKFLOW = '.github/workflows/preview-build.yml'


def require(condition, message):
    if not condition:
        raise ValueError(message)


def api(path):
    request = urllib.request.Request(API + path, headers={
        'Authorization': 'Bearer ' + os.environ['GH_TOKEN'],
        'Accept': 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
    })
    with urllib.request.urlopen(request, timeout=30) as response:
        return json.load(response)


def permission(login):
    require(re.fullmatch(r'[A-Za-z0-9\[\]-]+', login), 'Invalid login')
    try:
        return api('/collaborators/' + login + '/permission')['permission'] in {
            'write', 'maintain', 'admin'
        }
    except urllib.error.HTTPError as error:
        if error.code == 404:
            return False
        raise  # Lack of permission to verify is not permission to publish.


def provenance(pr, run, workflow_id):
    return (pr['state'] == 'open' and not pr['draft']
            and run['event'] == 'pull_request' and run['status'] == 'completed'
            and run['conclusion'] == 'success' and run['workflow_id'] == workflow_id
            and run['path'] == WORKFLOW
            and run['repository']['full_name'] == REPO
            and run['head_repository']['id'] == pr['head']['repo']['id']
            and run['head_sha'] == pr['head']['sha']
            and any(p['number'] == pr['number'] and p['head']['sha'] == pr['head']['sha']
                    for p in run['pull_requests']))


def authorized(pr, run, reviews, can_write):
    # Association CONTRIBUTOR is deliberately irrelevant. Forks always need approval.
    if (pr['head']['repo']['full_name'] == REPO
            and can_write(pr['user']['login'])
            and can_write(run['actor']['login'])
            and can_write(run['triggering_actor']['login'])):
        return True
    latest = {}
    for review in reviews:
        if review['state'] in {'APPROVED', 'CHANGES_REQUESTED', 'DISMISSED'}:
            latest[review['user']['login']] = review
    return any(r['state'] == 'APPROVED' and r['commit_id'] == pr['head']['sha']
               and r.get('body', '').strip() == 'Publish preview: ' + pr['head']['sha']
               and login != pr['user']['login'] and can_write(login)
               for login, r in latest.items())


def validate_zip(data, destination):
    require(len(data) <= MAX_ZIP, 'Compressed artifact too large')
    with zipfile.ZipFile(io.BytesIO(data)) as archive:
        entries = archive.infolist()
        require(0 < len(entries) <= MAX_FILES, 'Too many files')
        total = 0
        seen = set()
        for entry in entries:
            name = entry.filename
            parts = PurePosixPath(name).parts
            mode = entry.external_attr >> 16
            require(name and len(name) <= 240 and not name.startswith('/')
                    and '\\' not in name and ':' not in name
                    and all(32 <= ord(c) < 127 for c in name)
                    and all(p not in {'', '.', '..'} and not p.startswith('.') for p in parts)
                    and str(PurePosixPath(name)) == name.rstrip('/')
                    and not entry.flag_bits & 1, 'Unsafe artifact path')
            require(stat.S_IFMT(mode) in {0, stat.S_IFREG, stat.S_IFDIR}
                    and not mode & 0o7000, 'Links/special files forbidden')
            require(name.casefold() not in seen, 'Duplicate path')
            seen.add(name.casefold())
            total += entry.file_size
            require(total <= MAX_SITE and entry.file_size <= 20 * 1024 * 1024,
                    'Expanded artifact too large')
        require('index.html' in seen, 'Missing index.html')
        # Validate the entire directory before writing; never extractall().
        for entry in entries:
            target = destination.joinpath(*PurePosixPath(entry.filename).parts)
            if entry.is_dir():
                target.mkdir(parents=True, exist_ok=True)
            else:
                target.parent.mkdir(parents=True, exist_ok=True)
                with archive.open(entry) as source, target.open('xb') as output:
                    written = 0
                    while chunk := source.read(65536):
                        written += len(chunk)
                        require(written <= entry.file_size, 'Invalid expanded size')
                        output.write(chunk)
    return total


def download(artifact):
    # Never forward the GitHub token to the signed object-storage redirect.
    class NoRedirect(urllib.request.HTTPRedirectHandler):
        def redirect_request(self, req, fp, code, msg, headers, newurl):
            return None
    url = API + '/actions/artifacts/' + str(artifact['id']) + '/zip'
    request = urllib.request.Request(url, headers={'Authorization': 'Bearer ' + os.environ['GH_TOKEN']})
    try:
        urllib.request.build_opener(NoRedirect).open(request, timeout=30)
    except urllib.error.HTTPError as error:
        require(error.code == 302, 'Expected signed artifact redirect')
        url = error.headers['Location']
    else:
        raise ValueError('Expected redirect')
    require(url.startswith('https://'), 'Insecure artifact redirect')
    with urllib.request.urlopen(url, timeout=30) as response:
        data = response.read(MAX_ZIP + 1)
    require(len(data) <= MAX_ZIP, 'Artifact download too large')
    return data


def eligible(number, run_id, workflow_id):
    pr = api('/pulls/' + str(number))
    run = api('/actions/runs/' + str(run_id))
    if not provenance(pr, run, workflow_id):
        return False
    reviews = api('/pulls/' + str(number) + '/reviews?per_page=100')
    require(len(reviews) < 100, 'Review limit exceeded; refusing ambiguous approval')
    return authorized(pr, run, reviews, permission)


def main():
    workflow_id = api('/actions/workflows/preview-build.yml')['id']
    state = Path('preview-state.json')
    if sys.argv[1] == 'check':
        for item in json.loads(state.read_text()):
            require(eligible(item['pr'], item['run'], workflow_id), 'Preview authorization changed')
        return
    destination = Path('preview-site')
    destination.mkdir()  # Fresh aggregate; no previous branch/site content is trusted.
    (destination / 'index.html').write_text('<!doctype html><title>Documentation previews</title><p>Use the immutable revision URL from the workflow summary.</p>')
    prs = api('/pulls?state=open&per_page=100')
    require(len(prs) < 100, 'Open PR limit exceeded')
    selected = []
    total = 0
    for pr in prs:
        if pr['draft'] or not pr['head']['repo']:
            continue
        sha = pr['head']['sha']
        require(re.fullmatch('[0-9a-f]{40}', sha), 'Invalid SHA')
        runs = api('/actions/workflows/preview-build.yml/runs?event=pull_request&status=success&head_sha=' + sha + '&per_page=10')['workflow_runs']
        for run in runs:
            if not eligible(pr['number'], run['id'], workflow_id):
                continue
            artifacts = api('/actions/runs/' + str(run['id']) + '/artifacts?per_page=100')['artifacts']
            artifacts = [a for a in artifacts if a['name'] == 'preview-static' and not a['expired']]
            if len(artifacts) != 1:
                continue
            artifact = artifacts[0]
            require(artifact['size_in_bytes'] <= MAX_ZIP, 'Artifact too large')
            require(artifact['workflow_run']['id'] == run['id']
                    and artifact['workflow_run']['head_sha'] == sha, 'Artifact provenance mismatch')
            path = destination / 'pr' / str(pr['number']) / sha
            total += validate_zip(download(artifact), path)
            require(total <= 300 * 1024 * 1024 and len(selected) < 20, 'Aggregate preview limit exceeded')
            selected.append({'pr': pr['number'], 'run': run['id'], 'sha': sha})
            break
    state.write_text(json.dumps(selected))
    with open(os.environ['GITHUB_STEP_SUMMARY'], 'a') as summary:
        summary.write('Prepared immutable previews (relative to the Pages site):\n')
        for item in selected:
            summary.write(f"- PR {item['pr']}: `pr/{item['pr']}/{item['sha']}/`\n")


if __name__ == '__main__':
    main()
