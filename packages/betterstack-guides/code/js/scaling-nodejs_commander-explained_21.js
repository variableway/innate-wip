# Source: https://betterstack.com/community/guides/scaling-nodejs/commander-explained/
# Original language: javascript
# Normalized: js
# Block index: 21

[label cli.js]
...
[highlight]
const validTypes = ['default', 'special', 'custom'];
[/highlight]

program
  .command('create <name>')
  .description('Create a new item')
  .option('-t, --type <type>', 'Specify the item type', 'default')
  .action((name, options) => {
   if (name.length < 3) {
      ..
    }
[highlight]
    if (!validTypes.includes(options.type)) {
      console.error(`Error: Invalid type "${options.type}". Allowed types: ${validTypes.join(', ')}`);
      process.exit(1);
    }
[/highlight]
    console.log(`Creating item "${name}" of type "${options.type}"`);
  });
...