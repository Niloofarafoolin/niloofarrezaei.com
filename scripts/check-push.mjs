// Run by the local git "pre-push" hook. Refuses a push if any commit being sent contains one of the
// owner's private details, in any file it ever added. This matters because early local commits did.
//
// Git passes one line per branch on standard input: <local ref> <local commit> <remote ref> <remote commit>
// Try it by hand:  echo "refs/heads/main $(git rev-parse HEAD) refs/heads/main 0000000000000000000000000000000000000000" | node scripts/check-push.mjs
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { loadPrivateRules } from './private-rules.mjs';

const rules = loadPrivateRules();
if (!rules) {
  console.error('Push refused: private/forbidden.json is missing, so the commits cannot be checked for private details.');
  process.exit(1);
}
rules.push({ name: 'personal email', pattern: /gmail\.com/i });

const git = (...args) => execFileSync('git', args, { encoding: 'utf8', maxBuffer: 512 * 1024 * 1024 });
const NONE = /^0+$/;
const found = [];

for (const line of readFileSync(0, 'utf8').split('\n')) {
  const [localRef, localCommit, , remoteCommit] = line.trim().split(/\s+/);
  if (!localCommit || NONE.test(localCommit)) continue; // nothing to send, or a deletion

  // Every commit this push would add to the remote. For a new branch, that is everything not already there.
  const range = NONE.test(remoteCommit) ? [localCommit, '--not', '--remotes'] : [`${remoteCommit}..${localCommit}`];
  const commits = git('rev-list', ...range).split('\n').filter(Boolean);

  for (const commit of commits) {
    // The full text of everything this commit adds or changes, plus its message.
    const text = git('show', '--no-color', '--format=%B', '--root', '-m', '--first-parent', commit);
    for (const { name, pattern } of rules) {
      if (pattern.test(text)) found.push(`${localRef}: commit ${commit.slice(0, 7)} contains ${name}`);
    }
  }
  console.error(`Checked ${commits.length} commit(s) on ${localRef}.`);
}

if (found.length) {
  console.error(`\nPush refused. ${found.length} problem(s):`);
  for (const problem of [...new Set(found)]) console.error(' - ' + problem);
  console.error('\nPublish from one fresh commit of the approved files instead. See private/NOTES.md.');
  process.exit(1);
}
console.error('No private details in the commits being pushed.');
