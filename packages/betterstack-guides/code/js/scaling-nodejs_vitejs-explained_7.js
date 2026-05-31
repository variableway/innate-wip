# Source: https://betterstack.com/community/guides/scaling-nodejs/vitejs-explained/
# Original language: javascript
# Normalized: js
# Block index: 7

[label src/main.js]
const message = document.getElementById("message");
[highlight]
message.textContent = 'You just triggered HMR!';
[/highlight]

// Example: log a message to the console
console.log('Vite HMR is active');