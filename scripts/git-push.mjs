import git from 'isomorphic-git';
import http from 'isomorphic-git/http/node';
import fs from 'node:fs';
import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoDir = path.resolve(__dirname, '..');

let username = '';
let password = '';

try {
  const credInput = 'protocol=https\nhost=github.com\n\n';
  const credOutput = execSync('git credential fill', { input: credInput, encoding: 'utf-8' });
  for (const line of credOutput.split('\n')) {
    if (line.startsWith('username=')) username = line.substring(9).trim();
    if (line.startsWith('password=')) password = line.substring(9).trim();
  }
} catch (e) {
  console.error('Failed to get credentials from git credential fill:', e.message);
}

console.log('Initiating push to origin/main for user:', username);

try {
  const result = await git.push({
    fs,
    http,
    dir: repoDir,
    remote: 'origin',
    ref: 'main',
    onAuth: () => ({
      username: username,
      password: password,
    }),
    onProgress: (p) => {
      console.log(`[Push Progress] ${p.phase}: ${p.loaded}/${p.total || '?'}`);
    },
  });
  console.log('Push completed successfully!', result);
} catch (err) {
  console.error('Push error:', err);
}
