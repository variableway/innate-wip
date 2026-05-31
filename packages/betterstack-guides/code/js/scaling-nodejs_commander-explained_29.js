# Source: https://betterstack.com/community/guides/scaling-nodejs/commander-explained/
# Original language: javascript
# Normalized: js
# Block index: 29

[label cli.js]
...
const program = new Command();
[highlight]
function showError(message) {
  console.error(chalk.red.bold(`Error: ${message}`));
  process.exit(1);
}
[/highlight]

program
  .name("my-cli")
  .description("A CLI application built with Commander.js")
...