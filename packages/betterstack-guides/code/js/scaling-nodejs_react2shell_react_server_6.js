# Source: https://betterstack.com/community/guides/scaling-nodejs/react2shell_react_server/
# Original language: javascript
# Normalized: js
# Block index: 6

// This creates a function that, when called, will execute the code in the string.
const myMaliciousFunction = new Function(
  "require('child_process').execSync('rm -rf /')"
);

// Calling the function executes the command.
// myMaliciousFunction();