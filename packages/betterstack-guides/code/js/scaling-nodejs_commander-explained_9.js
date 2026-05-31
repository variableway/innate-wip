# Source: https://betterstack.com/community/guides/scaling-nodejs/commander-explained/
# Original language: javascript
# Normalized: js
# Block index: 9

[label cli.js]
...
program
  .command('list')
  .description('List all items')
[highlight]
  .option('-a, --all', 'list all items, including hidden ones')
  .action((options) => {
    console.log('Listing items...');
    if (options.all) {
      console.log('Including hidden items');
    }
  });
[/highlight]
...