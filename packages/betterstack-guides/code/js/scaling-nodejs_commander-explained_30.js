# Source: https://betterstack.com/community/guides/scaling-nodejs/commander-explained/
# Original language: javascript
# Normalized: js
# Block index: 30

[label cli.js]
const validTypes = ['default', 'special', 'custom'];

program
  .command('create <name>')
  .description('Create a new item')
  .option('-t, --type <type>', 'Specify the item type', 'default')
  .action((name, options) => {
    if (!validTypes.includes(options.type)) {
[highlight]
      showError(`Invalid type "${options.type}". Allowed types: ${validTypes.join(', ')}`);
[/highlight]
    }
    console.log(chalk.green(` Successfully created item "${name}" of type "${options.type}"`));
  });

...