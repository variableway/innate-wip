# Source: https://betterstack.com/community/guides/scaling-nodejs/introduction-to-bun-for-nodejs-users/
# Original language: javascript
# Normalized: js
# Block index: 18

[label index.js]
const response = await fetch("https://jsonplaceholder.typicode.com/todos/1");
const data = await response.json();
console.log("Fetched data:", data);