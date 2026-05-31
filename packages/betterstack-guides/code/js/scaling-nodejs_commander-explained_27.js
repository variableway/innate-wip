# Source: https://betterstack.com/community/guides/scaling-nodejs/commander-explained/
# Original language: javascript
# Normalized: js
# Block index: 27

[label cli.js]
...
program
  .command('create <name>')
  .description('Create a new item')
  .option('-t, --type <type>', 'Specify the item type', 'default')
  .action((name, options) => {
    if (name.length < 3) {
[highlight]
      console.error(chalk.red('Error: The item name must be at least 3 characters long.'));
[/highlight]
      process.exit(1);
    }
[highlight]
    console.log(chalk.green(`Successfully created item "${name}" of type "${options.type}"`));
[/highlight]
  });
...