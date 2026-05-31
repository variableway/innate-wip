# Source: https://betterstack.com/community/guides/scaling-nodejs/deno-overview-for-nodejs-users/
# Original language: javascript
# Normalized: js
# Block index: 23

[label app.js]
// Store a value in localStorage
localStorage.setItem("username", "denoUser");

// Retrieve the value from localStorage
const username = localStorage.getItem("username");
console.log("Stored username:", username);

// Remove the value from localStorage
localStorage.removeItem("username");

// Verify removal
const removedUsername = localStorage.getItem("username");
console.log("Removed username:", removedUsername);