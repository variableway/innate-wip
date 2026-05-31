# Source: https://betterstack.com/community/guides/scaling-nodejs/commander-explained/
# Original language: javascript
# Normalized: js
# Block index: 14

[label cli.js]
...
program
  .command('create <name>')
  .description('Create a new item')
[highlight]
  .option('-t, --type <type>', 'specify the item type', 'default')
  .action((name, options) => {
    console.log(`Creating item "${name}" of type "${options.type}"`);
  });
[/highlight]