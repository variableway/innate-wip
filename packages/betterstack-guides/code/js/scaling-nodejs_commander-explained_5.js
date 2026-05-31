# Source: https://betterstack.com/community/guides/scaling-nodejs/commander-explained/
# Original language: javascript
# Normalized: js
# Block index: 5

[label cli.js]
#!/usr/bin/env node

import { Command } from 'commander';

const program = new Command();

program
  .name('my-cli')
  .description('A CLI application built with Commander.js')
  .version('1.0.0')
[highlight]
  .option('-d, --debug', 'output extra debugging information')
  .option('-f, --file <path>', 'specify the file to process')
  .option('-t, --timeout <seconds>', 'specify the timeout in seconds', '60')
  .option('-v, --verbose', 'enable verbose output');
[/highlight]
program.parse();

[highlight]
// Access the options
const options = program.opts();
if (options.debug) {
  console.log('Debug mode is enabled');
  console.log('Options:', options);
}
[/highlight]