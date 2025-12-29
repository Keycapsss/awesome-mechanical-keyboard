/**
 * Fetch Updates Script
 *
 * Extracts recent commits from git history for display on the homepage.
 * Only includes user-relevant commits (docs, feat) and strips the
 * conventional commit prefix for cleaner display.
 *
 * Output: src/data/updates.json
 * Cache: 1 hour (skips fetch if cache is fresh)
 */

import { execSync } from 'child_process';
import fs from 'fs/promises';

// Configuration
const CACHE_FILE = 'src/data/updates.json';
const CACHE_MAX_AGE = 60 * 60 * 1000; // 1 hour
const MAX_COMMITS = 50; // Fetch more than needed to account for filtering
const ALLOWED_PREFIXES = ['docs', 'feat']; // Conventional commit prefixes to include

/**
 * Check if cached updates.json is still fresh
 */
async function isCacheValid() {
  try {
    const stats = await fs.stat(CACHE_FILE);
    return Date.now() - stats.mtimeMs < CACHE_MAX_AGE;
  } catch {
    return false;
  }
}

/**
 * Format ISO date to European format with leading zeros (DD.MM.YYYY)
 */
function formatDate(isoDate) {
  const date = new Date(isoDate);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

/**
 * Capitalize first letter of a string
 */
function capitalizeFirst(str) {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

async function fetchUpdates() {
  if (await isCacheValid()) {
    console.log('Updates cache is valid, skipping fetch');
    return;
  }

  console.log('Fetching recent commits...');

  // Git log format: full hash | subject | ISO date
  const log = execSync(
    `git log --format="%H|%s|%aI" -n ${MAX_COMMITS}`,
    { encoding: 'utf-8' }
  );

  const updates = log
    .trim()
    .split('\n')
    .filter(Boolean)
    // Parse each line into components
    .map(line => {
      const [hash, subject, date] = line.split('|');
      return { hash, subject, date };
    })
    // Keep only commits with allowed prefixes (docs:, feat:)
    .filter(({ subject }) => {
      const prefix = subject.split(':')[0]?.split('(')[0];
      return ALLOWED_PREFIXES.includes(prefix);
    })
    // Transform to final format
    .map(({ hash, subject, date }) => ({
      hash: hash.slice(0, 7),
      // Strip "docs:" or "feat(scope):" prefix from message
      message: capitalizeFirst(subject.replace(/^(docs|feat)(\([^)]+\))?:\s*/, '')),
      date: formatDate(date),
    }));

  await fs.writeFile(CACHE_FILE, JSON.stringify(updates, null, 2));
  console.log(`Saved ${updates.length} updates`);
}

fetchUpdates();
