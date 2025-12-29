import fs from 'node:fs/promises';
import path from 'node:path';

// Configuration
const OUTPUT_FILE = './src/data/contributors.json';
const REPO_OWNER = 'Keycapsss';
const REPO_NAME = 'awesome-mechanical-keyboard';
const CACHE_MAX_AGE_MS = 60 * 60 * 1000; // 1 hour

async function ensureDir(dir) {
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
}

async function isCacheValid() {
  try {
    const stats = await fs.stat(OUTPUT_FILE);
    const age = Date.now() - stats.mtimeMs;
    return age < CACHE_MAX_AGE_MS;
  } catch {
    return false;
  }
}

async function fetchContributors() {
  const token = process.env.GITHUB_TOKEN;
  const headers = {
    'User-Agent': 'keebfolio-contributors/1.0',
    Accept: 'application/vnd.github.v3+json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // Fetch all contributors with pagination
  const allContributors = [];
  let page = 1;

  while (true) {
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contributors?per_page=100&page=${page}`;
    const res = await fetch(url, { headers });

    if (!res.ok) {
      if (res.status === 403) {
        console.warn('[RATE LIMITED] Set GITHUB_TOKEN env var for higher limits');
      }
      throw new Error(`HTTP ${res.status}`);
    }

    const contributors = await res.json();
    if (contributors.length === 0) break;

    allContributors.push(...contributors);
    page++;

    // Safety limit to avoid infinite loops
    if (page > 10) break;
  }

  // Filter to only include users (exclude bots) and map to simplified structure
  return allContributors
    .filter((c) => c.type === 'User')
    .map((c) => ({
      id: c.id,
      login: c.login,
      contributions: c.contributions,
    }));
}

async function main() {
  // Check cache validity
  if (await isCacheValid()) {
    console.log('[CACHED] contributors.json is fresh, skipping fetch');
    return;
  }

  await ensureDir(path.dirname(OUTPUT_FILE));

  console.log('Fetching repository contributors...');

  try {
    const contributors = await fetchContributors();
    await fs.writeFile(OUTPUT_FILE, JSON.stringify(contributors, null, 2));
    console.log(`[DONE] Wrote ${contributors.length} contributors to ${OUTPUT_FILE}`);
  } catch (err) {
    console.error(`[ERROR] ${err.message}`);
    process.exit(1);
  }
}

main().catch(console.error);
