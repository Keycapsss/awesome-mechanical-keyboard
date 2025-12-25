import fs from 'node:fs/promises';
import path from 'node:path';

// Configuration
const PAGES_DIR = './src/pages/en';
const OUTPUT_FILE = './src/data/contributors.json';
const REPO_OWNER = 'Keycapsss';
const REPO_NAME = 'awesome-mechanical-keyboard';
const CACHE_MAX_AGE_MS = 60 * 60 * 1000; // 1 hour
const REQUEST_DELAY_MS = 100; // Delay between API requests to avoid rate limits

// Files that were converted from .md to .astro (git doesn't track as renames)
// Maps current path to array of legacy paths to also fetch contributors from
const LEGACY_PATHS = {
  'src/pages/en/staggered.astro': ['src/pages/en/staggered.md'],
  'src/pages/en/ortholinear.astro': ['src/pages/en/ortholinear.md'],
  'src/pages/en/split.astro': ['src/pages/en/split.md'],
  'src/pages/en/other.astro': ['src/pages/en/other.md'],
};

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

async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchContributors(filePath) {
  const token = process.env.GITHUB_TOKEN;
  const headers = {
    'User-Agent': 'keebfolio-contributors/1.0',
    Accept: 'application/vnd.github.v3+json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/commits?path=${encodeURIComponent(filePath)}&per_page=100`;

  try {
    const res = await fetch(url, { headers });

    if (!res.ok) {
      if (res.status === 403) {
        console.warn(`[RATE LIMITED] ${filePath} - Set GITHUB_TOKEN env var for higher limits`);
      } else {
        console.warn(`[HTTP ${res.status}] ${filePath}`);
      }
      return [];
    }

    const commits = await res.json();

    // Extract unique authors
    const authors = new Map();
    for (const commit of commits) {
      if (commit.author && commit.author.id) {
        authors.set(commit.author.id, {
          id: commit.author.id,
          login: commit.author.login,
        });
      }
    }

    return Array.from(authors.values());
  } catch (err) {
    console.error(`[ERROR] ${filePath}: ${err.message}`);
    return [];
  }
}

async function getPageFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.isFile() && (entry.name.endsWith('.astro') || entry.name.endsWith('.md'))) {
      files.push(path.join(dir, entry.name));
    }
  }

  return files;
}

async function main() {
  // Check cache validity
  if (await isCacheValid()) {
    console.log('[CACHED] contributors.json is fresh, skipping fetch');
    return;
  }

  await ensureDir(path.dirname(OUTPUT_FILE));

  const pageFiles = await getPageFiles(PAGES_DIR);
  console.log(`Fetching contributors for ${pageFiles.length} pages...`);

  const contributors = {};

  for (const filePath of pageFiles) {
    // Normalize path for JSON keys (use forward slashes)
    const normalizedPath = filePath.replace(/\\/g, '/');

    console.log(`[FETCHING] ${path.basename(filePath)}...`);
    const authors = await fetchContributors(normalizedPath);

    // Also fetch from legacy paths (for files that were renamed)
    const legacyPaths = LEGACY_PATHS[normalizedPath] || [];
    for (const legacyPath of legacyPaths) {
      console.log(`  [LEGACY] ${path.basename(legacyPath)}...`);
      const legacyAuthors = await fetchContributors(legacyPath);
      // Merge unique by ID
      for (const author of legacyAuthors) {
        if (!authors.find((a) => a.id === author.id)) {
          authors.push(author);
        }
      }
      await delay(REQUEST_DELAY_MS);
    }

    contributors[normalizedPath] = authors;

    if (authors.length > 0) {
      console.log(`  -> Found ${authors.length} contributor(s)`);
    }

    // Rate limit protection
    await delay(REQUEST_DELAY_MS);
  }

  // Write output
  await fs.writeFile(OUTPUT_FILE, JSON.stringify(contributors, null, 2));
  console.log(`[DONE] Wrote ${OUTPUT_FILE}`);
}

main().catch(console.error);
