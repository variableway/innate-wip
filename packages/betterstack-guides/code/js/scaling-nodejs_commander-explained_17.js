# Source: https://betterstack.com/community/guides/scaling-nodejs/commander-explained/
# Original language: javascript
# Normalized: js
# Block index: 17

[label cli.js]
...
program
  .command('create <name>')
  .description('Create a new item')
  .option('-t, --type <type>', 'Specify the item type', 'default')
  .action((name, options) => {
[highlight]
    if (name.length < 3) {
      console.error('Error: The item name must be at least 3 characters long.');
      process.exit(1); // Exit with an error code
    }
[/highlight]
    console.log(`Creating item "${name}" of type "${options.type}"`);
  });
...