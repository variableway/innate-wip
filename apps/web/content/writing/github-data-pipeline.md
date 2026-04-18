---
title: "How We Sync GitHub Data to a Static Website"
slug: github-data-pipeline
date: 2026-04-14
author: Innate Team
category: article
tags: [github, data-pipeline, automation, github-actions, static-site]
status: published
excerpt: "How we fetch repositories, issues, and AGENTS.md from GitHub and turn them into a live static website — with scripts, data structures, and GitHub Actions automation."
---

## The Problem

We build multiple open-source projects under the [variableway](https://github.com/variableway) org on GitHub. We wanted a website that shows:

- **Projects** — what we're building, with descriptions and repo links
- **Issues** — what's in progress, what's done, across all repos
- **Weekly summaries** — auto-generated from closed issues
- **Insights** — learnings and security incident reports

All of this needs to be **static** — no database, no server, just HTML files built from data.

## The Architecture

```
GitHub API ──► Node.js Scripts ──► JSON Files ──► Next.js Build ──► Static HTML
                (fetch-*.js)       (data/*.json)   (SSG/ISR)
```

The data flow is simple:

1. **Fetch scripts** call the GitHub REST API and save JSON locally
2. **Next.js pages** read the JSON at build time
3. **Static export** generates HTML that can be hosted anywhere

## The Scripts

All scripts live in `apps/web/scripts/`. Each one handles one data source:

### Fetching Projects (`fetch-projects.js`)

Gets all repositories from the GitHub org:

```javascript
async function fetchRepos(org) {
  const repos = [];
  let page = 1;

  while (true) {
    const url = `https://api.github.com/orgs/${org}/repos?per_page=100&page=${page}`;
    const data = await githubFetch(url);
    if (data.length === 0) break;
    repos.push(...data);
    page++;
  }

  return repos.filter(repo =>
    repo.name !== '.github' &&
    !repo.archived &&
    !repo.disabled
  );
}
```

Each repo is transformed into a simple project object:

```json
{
  "id": "spark-cli",
  "name": "spark-cli",
  "description": "Daily CLI command ideas fired by spark",
  "repoUrl": "https://github.com/variableway/spark-cli"
}
```

### Fetching Issues (`fetch-issues.js`)

Gets all issues (not PRs) from each repository:

```javascript
async function fetchIssues(org, repo) {
  const issues = [];
  let page = 1;

  while (true) {
    const url = `https://api.github.com/repos/${org}/${repo}/issues?state=all&per_page=100&page=${page}`;
    const data = await githubFetch(url);
    if (data.length === 0) break;
    const filtered = data.filter(item => !item.pull_request);
    issues.push(...filtered);
    page++;
  }
  return issues;
}
```

Each issue is stored with labels, status, and metadata:

```json
{
  "id": "issue-4246090044",
  "number": 4246090044,
  "title": "Support Github Issue creation by title and a folder of documents",
  "description": "We want to be able to create a GitHub issue...",
  "status": "closed",
  "project": "spark-cli",
  "labels": [
    { "id": "enhancement", "name": "enhancement", "color": "a2eeef" }
  ],
  "createdAt": "2026-04-12T18:38:48Z",
  "closedAt": "2026-04-12T19:13:24Z",
  "url": "https://github.com/variableway/spark-cli/issues/4246090044",
  "author": "variableway"
}
```

### Fetching AGENTS.md (`fetch-agents.js`)

Reads the `AGENTS.md` file from each repository's default branch. This is the AI agent context file that describes the project's architecture, conventions, and key patterns. The script extracts it via the GitHub Contents API and stores it alongside the project data.

## The Data Structure

All data lives in `apps/web/data/` as JSON files:

```
data/
├── repos.json        # Project list from GitHub org
├── issues.json       # All issues across repos (with projects embedded)
├── projects.json     # Projects with AGENTS.md analysis
├── weekly.json       # Auto-generated weekly summaries
├── insights.json     # Curated insights and reports
└── sync-state.json   # Tracks last sync time and known issue IDs
```

### Type Definitions

The TypeScript types are defined in `lib/making/types.ts`:

```typescript
export interface Issue {
  id: string
  number: number
  title: string
  description: string
  status: 'open' | 'closed'
  project: string
  labels: IssueLabel[]
  createdAt: string
  updatedAt: string
  closedAt?: string
  url?: string
  author?: string
}

export interface WeeklySummary {
  id: string
  weekNumber: number
  year: number
  title: string
  dateRange: { start: string; end: string }
  completedIssues: string[]
  evaluations: WeeklyEvaluation
  mindsetAnalysis: WeeklyMindset
}

export interface Insight {
  id: string
  title: string
  date: string
  summary: string
  category: 'practice' | 'analysis' | 'guide'
  content: string  // Markdown content
}
```

## Setting Up GitHub Actions Automation

Currently, the scripts run manually. Here's how to automate them with GitHub Actions:

### Step 1: Create the Workflow File

Create `.github/workflows/sync-data.yml`:

```yaml
name: Sync GitHub Data

on:
  schedule:
    # Run every 4 hours
    - cron: '0 */4 * * *'
  workflow_dispatch: # Allow manual trigger

permissions:
  contents: write

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with:
          version: 10

      - uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install dependencies
        run: pnpm install

      - name: Fetch projects
        run: node apps/web/scripts/fetch-projects.js
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          GITHUB_ORG: variableway

      - name: Fetch issues
        run: node apps/web/scripts/fetch-issues.js
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          GITHUB_ORG: variableway

      - name: Fetch AGENTS.md
        run: node apps/web/scripts/fetch-agents.js
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          GITHUB_ORG: variableway

      - name: Generate weekly summaries
        run: node apps/web/scripts/generate-weekly.js

      - name: Check for changes
        id: check
        run: |
          if git diff --quiet apps/web/data/; then
            echo "changed=false" >> $GITHUB_OUTPUT
          else
            echo "changed=true" >> $GITHUB_OUTPUT
          fi

      - name: Commit and push changes
        if: steps.check.outputs.changed == 'true'
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add apps/web/data/
          git commit -m "Update data [$(date +%Y-%m-%d-%H:%M)]"
          git push
```

### Step 2: Configure the Token

The workflow uses the built-in `GITHUB_TOKEN` that GitHub Actions provides automatically. For org-level access:

1. Go to **Settings > Secrets and variables > Actions**
2. If you need higher rate limits, create a Personal Access Token with `repo` scope
3. Add it as `GITHUB_TOKEN` or a custom secret name

### Step 3: Trigger Options

The workflow supports three trigger modes:

| Mode | Config | Use Case |
|------|--------|----------|
| **Scheduled** | `cron: '0 */4 * * *'` | Auto-sync every 4 hours |
| **Manual** | `workflow_dispatch` | Click "Run workflow" in Actions tab |
| **On push** | `push: { paths: ['docs/**'] }` | When insights/docs change |

## How the Website Reads the Data

The Next.js pages load data at build time:

```typescript
// apps/web/lib/making/data.ts
import issuesData from '@/data/issues.json'
import projectsData from '@/data/projects.json'
import weeklyData from '@/data/weekly.json'
import insightsData from '@/data/insights.json'

export function getAllIssues(): Issue[] {
  return issuesData.issues
}

export function getProjects(): Project[] {
  return projectsData.projects
}
```

Since the JSON is imported statically, it's bundled at build time — no runtime API calls needed. The website works entirely offline after build.

## Key Design Decisions

1. **JSON over database** — No database to manage. Data lives in Git alongside the code.
2. **Scripts over framework** — Simple Node.js scripts instead of a CMS or framework.
3. **Incremental sync** — The `sync-state.json` file tracks what's already been fetched, so we only process new data.
4. **Filter, don't transform** — GitHub API data is filtered (remove PRs, archived repos) but kept close to its original shape.

> The simplest data pipeline is the one you can understand in 5 minutes. Fetch JSON, commit JSON, build site.
