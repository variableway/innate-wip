# Source: https://betterstack.com/community/guides/scaling-nodejs/commander-explained/
# Original language: javascript
# Normalized: js
# Block index: 11

[label cli.js]
program
  .command('list')
  ....

[highlight]
program
  .command('create <name>')
  .description('Create a new item')
  .action((name) => {
    console.log(`Creating item "${name}"`);
  });
[/highlight]

program.parse();
...