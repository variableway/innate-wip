#!/usr/bin/env node
/**
 * Submit Tasks to GitHub Issues
 *
 * Reads a markdown task file, splits by "## Task N:", and creates GitHub Issues.
 */

const fs = require('fs');
const path = require('path');

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_ORG = process.env.GITHUB_ORG || 'variableway';
const GITHUB_REPO = process.env.GITHUB_REPO || 'innate-websites';

// Parse CLI args
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const filePathArg = args.find(a => !a.startsWith('--'));

if (!filePathArg) {
  console.error('Usage: node submit-tasks-to-issues.js <path-to-tasks.md> [--dry-run]');
  process.exit(1);
}

const filePath = path.resolve(filePathArg);
if (!fs.existsSync(filePath)) {
  console.error(`File not found: ${filePath}`);
  process.exit(1);
}

// GitHub API helper
async function githubPost(url, body) {
  const headers = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'innate-task-submitter',
    'Content-Type': 'application/json',
  };

  if (GITHUB_TOKEN) {
    headers['Authorization'] = `token ${GITHUB_TOKEN}`;
  }

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`GitHub API error: ${response.status} ${response.statusText} - ${text}`);
  }

  return response.json();
}

// Parse tasks from markdown
function parseTasks(content) {
  // Match "## Task N: Title" sections
  const taskRegex = /##\s*Task\s*(\d+)\s*:\s*(.*?)\n([\s\S]*?)(?=##\s*Task\s*\d+|$)/gi;
  const tasks = [];
  let match;

  while ((match = taskRegex.exec(content)) !== null) {
    tasks.push({
      taskNumber: parseInt(match[1], 10),
      title: match[2].trim(),
      body: match[3].trim(),
    });
  }

  return tasks;
}

async function main() {
  const content = fs.readFileSync(filePath, 'utf-8');
  const tasks = parseTasks(content);

  if (tasks.length === 0) {
    console.log('No tasks found in the file.');
    process.exit(0);
  }

  console.log(`📄 Found ${tasks.length} task(s) in ${path.basename(filePath)}\n`);

  for (const task of tasks) {
    const issueTitle = `[Task ${task.taskNumber}] ${task.title}`;
    const issueBody = `## Task ${task.taskNumber}: ${task.title}\n\n${task.body}`;

    console.log(`── Task ${task.taskNumber}: ${task.title} ──`);

    if (dryRun) {
      console.log('📝 [DRY RUN] Would create issue:');
      console.log(`   Title: ${issueTitle}`);
      console.log(`   Body length: ${issueBody.length} chars\n`);
      continue;
    }

    try {
      const issue = await githubPost(
        `https://api.github.com/repos/${GITHUB_ORG}/${GITHUB_REPO}/issues`,
        {
          title: issueTitle,
          body: issueBody,
          labels: ['task'],
        }
      );
      console.log(`✅ Created Issue #${issue.number}: ${issue.html_url}\n`);
    } catch (error) {
      console.error(`❌ Failed to create issue: ${error.message}\n`);
    }
  }
}

main();
