#!/usr/bin/env node
/**
 * GitHub Projects Fetcher Script
 *
 * Fetches repositories from GitHub organization and saves them locally.
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');
const REPOS_FILE = path.join(DATA_DIR, 'repos.json');
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_ORG = process.env.GITHUB_ORG || 'variableway';

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// GitHub API helper
async function githubFetch(url) {
  const headers = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'innate-projects-fetcher',
  };

  if (GITHUB_TOKEN) {
    headers['Authorization'] = `token ${GITHUB_TOKEN}`;
  }

  const response = await fetch(url, { headers });

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    let detail = '';
    try {
      const json = JSON.parse(body);
      detail = json.message || '';
    } catch {}
    throw new Error(`GitHub API error: ${response.status} ${response.statusText}${detail ? ' - ' + detail : ''}`);
  }

  return response.json();
}

// Fetch all repositories for an organization
async function fetchRepos(org) {
  const repos = [];
  let page = 1;

  while (true) {
    const url = `https://api.github.com/orgs/${org}/repos?per_page=100&page=${page}`;
    const data = await githubFetch(url);

    if (data.length === 0) break;

    repos.push(...data);
    page++;

    // Safety limit
    if (page > 10) break;
  }

  // Exclude .github repo and archived repos
  return repos.filter(repo =>
    repo.name !== '.github' &&
    !repo.archived &&
    !repo.disabled
  );
}

// Main function
async function main() {
  console.log(`🚀 Fetching projects from ${GITHUB_ORG}...`);

  try {
    const repos = await fetchRepos(GITHUB_ORG);
    console.log(`Found ${repos.length} repositories`);

    const projects = repos.map(repo => ({
      id: repo.name,
      name: repo.name,
      description: repo.description || '',
      color: '#8FA68E',
      repoUrl: repo.html_url,
    }));

    const data = {
      projects,
      lastUpdated: new Date().toISOString(),
    };

    fs.writeFileSync(REPOS_FILE, JSON.stringify(data, null, 2));
    console.log(`✅ Saved ${projects.length} projects to ${path.basename(REPOS_FILE)}`);
  } catch (error) {
    console.error('❌ Error fetching projects:', error.message);
    process.exit(1);
  }
}

main();
