#!/usr/bin/env node
const { runDaemon } = require('../src/index.js');

const args = process.argv.slice(2);
const command = args[0] || 'help';

switch (command) {
  case 'sync':
    runDaemon().catch(err => {
      console.error(err);
      process.exit(1);
    });
    break;
  case 'help':
  default:
    console.log(`
Task Watcher CLI

Commands:
  task-watcher sync    Run local sync: fetch issues, agents, weekly summary, then commit & push
  task-watcher help    Show this help message

Environment variables:
  GITHUB_TOKEN    GitHub personal access token (optional, for private repos)
  GITHUB_ORG      GitHub organization name (default: variableway)
`);
    break;
}
