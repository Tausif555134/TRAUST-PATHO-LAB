import git from 'isomorphic-git';
import http from 'isomorphic-git/http/node';
import fs from 'node:fs';
import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoDir = path.resolve(__dirname, '..');

// 1. Get credentials from Windows Credential Manager
let username = 'Tausif555134';
let password = '';

try {
  const credInput = 'protocol=https\nhost=github.com\n\n';
  let credOutput = '';
  try {
    credOutput = execSync('git credential-manager get', { input: credInput, encoding: 'utf-8' });
  } catch {
    credOutput = execSync('git credential fill', { input: credInput, encoding: 'utf-8' });
  }
  for (const line of credOutput.split('\n')) {
    if (line.startsWith('username=')) username = line.substring(9).trim();
    if (line.startsWith('password=')) password = line.substring(9).trim();
  }
} catch (e) {
  console.error('Failed to get credentials:', e.message);
}

if (!password) {
  console.error('No password/token found in credential manager!');
  process.exit(1);
}

console.log('Using GitHub credentials for:', username);

// 2. Ensure remote is configured
try {
  await git.addRemote({
    fs,
    dir: repoDir,
    remote: 'origin',
    url: 'https://github.com/Tausif555134/TRAUST-PATHO-LAB.git',
  });
} catch {}

// 3. Resolve origin/main ref
let remoteSha;
try {
  remoteSha = await git.resolveRef({ fs, dir: repoDir, ref: 'refs/remotes/origin/main' });
} catch {
  console.log('Fetching origin/main first...');
  await git.fetch({
    fs,
    http,
    dir: repoDir,
    remote: 'origin',
    ref: 'main',
    onAuth: () => ({ username, password }),
  });
  remoteSha = await git.resolveRef({ fs, dir: repoDir, ref: 'refs/remotes/origin/main' });
}

console.log('Remote main commit SHA:', remoteSha);

// 4. Update local main branch to track remote main commit
await git.writeRef({
  fs,
  dir: repoDir,
  ref: 'refs/heads/main',
  value: remoteSha,
  force: true,
});

fs.writeFileSync(path.join(repoDir, '.git', 'HEAD'), 'ref: refs/heads/main\n');

// 5. Stage modified and untracked files according to statusMatrix
console.log('Scanning working tree files...');
const status = await git.statusMatrix({ fs, dir: repoDir });

for (const [filepath, head, workdir, stage] of status) {
  // If file is untracked or modified in working directory
  if (workdir !== stage) {
    if (workdir === 0) {
      await git.remove({ fs, dir: repoDir, filepath });
      console.log('Staged removal:', filepath);
    } else {
      await git.add({ fs, dir: repoDir, filepath });
      console.log('Staged:', filepath);
    }
  }
}

// 6. Commit changes
console.log('Creating commit...');
const commitSha = await git.commit({
  fs,
  dir: repoDir,
  message: process.argv[2] || 'refactor: split single page into clean multi-page public architecture (/, /tests, /book, /contact)',
  author: {
    name: 'Tausif555134',
    email: 'tousifalalm5@gmail.com',
  },
  committer: {
    name: 'Tausif555134',
    email: 'tousifalalm5@gmail.com',
  },
});

console.log('Created commit SHA:', commitSha);

// 7. Push to origin/main
console.log('Pushing to https://github.com/Tausif555134/TRAUST-PATHO-LAB.git (main)...');
const pushResult = await git.push({
  fs,
  http,
  dir: repoDir,
  remote: 'origin',
  ref: 'main',
  onAuth: () => ({ username, password }),
  onProgress: (p) => {
    console.log(`[Push Progress] ${p.phase}: ${p.loaded}/${p.total || '?'}`);
  },
});

console.log('Push result:', JSON.stringify(pushResult, null, 2));
console.log('Successfully pushed to GitHub!');
