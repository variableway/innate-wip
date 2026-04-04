const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '../../..');
const WEB_DIR = path.join(ROOT_DIR, 'apps/web');
const DATA_DIR = path.join(WEB_DIR, 'data');

function runCommand(cmd, args = [], options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, {
      stdio: 'inherit',
      cwd: ROOT_DIR,
      env: { ...process.env, ...options.env },
    });

    child.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Command "${cmd} ${args.join(' ')}" exited with code ${code}`));
      } else {
        resolve();
      }
    });

    child.on('error', (err) => {
      reject(err);
    });
  });
}

function runNodeScript(scriptPath, env = {}) {
  return runCommand('node', [scriptPath], { env });
}

async function hasDataChanges() {
  return new Promise((resolve, reject) => {
    const child = spawn('git', ['diff', '--quiet', 'apps/web/data/'], {
      stdio: 'pipe',
      cwd: ROOT_DIR,
    });

    child.on('close', (code) => {
      // git diff --quiet returns 0 if no changes, 1 if changes exist
      resolve(code !== 0);
    });

    child.on('error', reject);
  });
}

async function commitAndPush() {
  const now = new Date();
  const timestamp = now.toISOString().replace(/[:T]/g, '-').slice(0, 16);
  const message = `Update issues and weekly data [${timestamp}]`;

  await runCommand('git', ['add', 'apps/web/data/']);
  await runCommand('git', ['commit', '-m', message]);
  await runCommand('git', ['push']);
}

async function runDaemon() {
  console.log('🚀 Task Watcher Daemon started\n');

  // Ensure data directory exists
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  // Seed empty data files if missing so scripts don't crash
  const reposPath = path.join(DATA_DIR, 'repos.json');
  const issuesPath = path.join(DATA_DIR, 'issues.json');
  const weeklyPath = path.join(DATA_DIR, 'weekly.json');
  const nowIso = new Date().toISOString();

  if (!fs.existsSync(reposPath)) {
    fs.writeFileSync(reposPath, JSON.stringify({ projects: [], lastUpdated: nowIso }, null, 2));
  }
  if (!fs.existsSync(issuesPath)) {
    fs.writeFileSync(issuesPath, JSON.stringify({ projects: [], issues: [], lastUpdated: nowIso }, null, 2));
  }
  if (!fs.existsSync(weeklyPath)) {
    fs.writeFileSync(weeklyPath, JSON.stringify({ summaries: [], lastUpdated: nowIso }, null, 2));
  }

  let hasErrors = false;

  // 1. Fetch projects
  console.log('📡 Step 1/4: Fetching projects from GitHub...');
  try {
    await runNodeScript(path.join(WEB_DIR, 'scripts/fetch-projects.js'));
    console.log('✅ Projects fetched\n');
  } catch (err) {
    console.error(`❌ Projects fetch failed: ${err.message}\n`);
    hasErrors = true;
  }

  // 2. Fetch issues
  console.log('📡 Step 2/4: Fetching issues from GitHub...');
  try {
    await runNodeScript(path.join(WEB_DIR, 'scripts/fetch-issues.js'));
    console.log('✅ Issues fetched\n');
  } catch (err) {
    console.error(`❌ Issues fetch failed: ${err.message}\n`);
    hasErrors = true;
  }

  // 3. Fetch agents
  console.log('📡 Step 3/4: Fetching AGENTS.md files...');
  try {
    await runNodeScript(path.join(WEB_DIR, 'scripts/fetch-agents.js'));
    console.log('✅ AGENTS.md fetched\n');
  } catch (err) {
    console.error(`❌ AGENTS.md fetch failed: ${err.message}\n`);
    hasErrors = true;
  }

  // 4. Generate weekly summary
  console.log('📡 Step 4/4: Generating weekly summary...');
  try {
    await runNodeScript(path.join(WEB_DIR, 'scripts/generate-weekly.js'));
    console.log('✅ Weekly summary generated\n');
  } catch (err) {
    console.error(`❌ Weekly summary generation failed: ${err.message}\n`);
    hasErrors = true;
  }

  // 4. Check for changes and commit
  console.log('🔍 Checking for data changes...');
  try {
    const hasChanges = await hasDataChanges();

    if (hasChanges) {
      console.log('📝 Changes detected, committing and pushing...');
      await commitAndPush();
      console.log('✅ Data committed and pushed successfully!');
    } else {
      console.log('ℹ️  No changes detected, nothing to commit.');
    }
  } catch (err) {
    console.error(`❌ Commit/push failed: ${err.message}\n`);
    hasErrors = true;
  }

  if (hasErrors) {
    console.log('\n⚠️  Task Watcher Daemon finished with errors.');
    process.exit(1);
  } else {
    console.log('\n🎉 Task Watcher Daemon finished successfully.');
  }
}

module.exports = { runDaemon };
