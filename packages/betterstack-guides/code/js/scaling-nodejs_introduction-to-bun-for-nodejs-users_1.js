# Source: https://betterstack.com/community/guides/scaling-nodejs/introduction-to-bun-for-nodejs-users/
# Original language: javascript
# Normalized: js
# Block index: 1

[label index.js]
function welcomeUser(user) {
  return `Hello, ${user.name}!`;
}
console.log(welcomeUser({ name: "Alice" }));