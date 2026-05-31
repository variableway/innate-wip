# Source: https://betterstack.com/community/guides/scaling-nodejs/vitejs-explained/
# Original language: javascript
# Normalized: js
# Block index: 12

[label src/main.js]
[highlight]
import "./style.scss";
[/highlight]

const message = document.getElementById("message");
message.textContent = "You just triggered HMR!";

// Example: log a message to the console
console.log("Vite HMR is active");