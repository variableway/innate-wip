# Source: https://betterstack.com/community/guides/scaling-nodejs/commander-explained/
# Original language: javascript
# Normalized: js
# Block index: 7

[label cli.js]
#!/usr/bin/env node

import { Command } from 'commander';

const program = new Command();

program
  .name('my-cli')
  .description('A CLI application built with Commander.js')
  .version('1.0.0')
  ....
  .option('-v, --verbose', 'enable verbose output');

[highlight]
program
  .command('list')
  .description('List all items')
  .action(() => {
    console.log('Listing items...');
  });
[/highlight]
program.parse();
// Access the options
const options = program.opts();
...