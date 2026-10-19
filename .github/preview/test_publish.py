import io
from pathlib import Path
import stat
import tempfile
import unittest
import zipfile
from unittest.mock import patch

import publish as p

SHA = 'a' * 40


def fixtures():
    pr = {'number': 1, 'state': 'open', 'draft': False, 'user': {'login': 'author'},
          'head': {'sha': SHA, 'repo': {'id': 1, 'full_name': p.REPO}}}
    run = {'event': 'pull_request', 'status': 'completed', 'conclusion': 'success',
           'workflow_id': 7, 'path': p.WORKFLOW, 'repository': {'full_name': p.REPO},
           'head_repository': {'id': 1}, 'head_sha': SHA,
           'pull_requests': [{'number': 1, 'head': {'sha': SHA}}],
           'actor': {'login': 'author'}, 'triggering_actor': {'login': 'author'}}
    review = {'state': 'APPROVED', 'commit_id': SHA, 'body': 'Publish preview: ' + SHA,
              'user': {'login': 'maintainer'}}
    return pr, run, review


class AuthorizationTests(unittest.TestCase):
    def test_trusted_same_repository(self):
        pr, run, _ = fixtures()
        self.assertTrue(p.authorized(pr, run, [], lambda u: u == 'author'))

    def test_contributor_is_not_permission(self):
        pr, run, _ = fixtures()
        pr['author_association'] = 'CONTRIBUTOR'
        self.assertFalse(p.authorized(pr, run, [], lambda _: False))

    def test_forks_require_explicit_revision_approval(self):
        pr, run, review = fixtures()
        pr['head']['repo']['full_name'] = 'example/fork'
        can_write = lambda u: u in {'author', 'maintainer'}
        self.assertFalse(p.authorized(pr, run, [], can_write))
        self.assertTrue(p.authorized(pr, run, [review], can_write))
        for field, value in [('commit_id', 'b' * 40), ('body', 'Looks good'), ('state', 'DISMISSED')]:
            invalid = dict(review, **{field: value})
            self.assertFalse(p.authorized(pr, run, [invalid], can_write))
        self.assertFalse(p.authorized(pr, run, [review], lambda _: False))
        self.assertFalse(p.authorized(pr, run, [review, dict(review, state='CHANGES_REQUESTED')], can_write))
        pr['head']['sha'] = 'b' * 40
        self.assertFalse(p.authorized(pr, run, [review], can_write))

    def test_provenance_and_stale_revision(self):
        pr, run, _ = fixtures()
        self.assertTrue(p.provenance(pr, run, 7))
        for field, value in [('head_sha', 'b' * 40), ('event', 'push'), ('workflow_id', 8),
                             ('path', 'evil.yml'), ('pull_requests', []), ('conclusion', 'failure')]:
            self.assertFalse(p.provenance(pr, dict(run, **{field: value}), 7))
        for field, value in [('state', 'closed'), ('draft', True)]:
            self.assertFalse(p.provenance(dict(pr, **{field: value}), run, 7))
        pr['head']['sha'] = 'c' * 40
        self.assertFalse(p.provenance(pr, run, 7))


class RevalidationTests(unittest.TestCase):
    def test_changed_revision_aborts_pre_and_post_deployment_check(self):
        with tempfile.TemporaryDirectory() as directory:
            state = Path(directory) / 'state.json'
            state.write_text('[{"pr": 1, "run": 42, "sha": "' + SHA + '"}]')
            with patch.object(p, 'Path', return_value=state), \
                    patch.object(p, 'api', return_value={'id': 7}), \
                    patch.object(p, 'eligible', return_value=False) as eligible, \
                    patch.object(p.sys, 'argv', ['publish.py', 'check']):
                with self.assertRaisesRegex(ValueError, 'authorization changed'):
                    p.main()
                eligible.assert_called_once_with(1, 42, 7)


class ArtifactTests(unittest.TestCase):
    def archive(self, name='assets/app.js', mode=stat.S_IFREG | 0o644):
        data = io.BytesIO()
        with zipfile.ZipFile(data, 'w') as z:
            z.writestr('index.html', '<html>preview</html>')
            info = zipfile.ZipInfo(name)
            info.external_attr = mode << 16
            z.writestr(info, 'content')
        return data.getvalue()

    def test_static_files(self):
        with tempfile.TemporaryDirectory() as directory:
            p.validate_zip(self.archive(), Path(directory))
            self.assertEqual((Path(directory) / 'assets/app.js').read_text(), 'content')

    def test_bad_paths(self):
        for name in ['../escape', '/absolute', 'a/../../escape', 'a\\escape', '.git/config',
                     'a//b', 'a/./b', 'C:/escape', 'a\x01b', 'INDEX.HTML']:
            with self.subTest(name=name), tempfile.TemporaryDirectory() as directory:
                with self.assertRaises(ValueError):
                    p.validate_zip(self.archive(name), Path(directory))
                self.assertEqual(list(Path(directory).iterdir()), [])

    def test_special_files(self):
        for mode in [stat.S_IFLNK | 0o777, stat.S_IFIFO | 0o644, stat.S_IFCHR | 0o644,
                     stat.S_IFREG | 0o4644]:
            with tempfile.TemporaryDirectory() as directory, self.assertRaises(ValueError):
                p.validate_zip(self.archive(mode=mode), Path(directory))

    def test_size_and_file_limits(self):
        for limit in ['MAX_ZIP', 'MAX_SITE', 'MAX_FILES']:
            with patch.object(p, limit, 1), tempfile.TemporaryDirectory() as directory:
                with self.assertRaises(ValueError):
                    p.validate_zip(self.archive(), Path(directory))


if __name__ == '__main__':
    unittest.main()
