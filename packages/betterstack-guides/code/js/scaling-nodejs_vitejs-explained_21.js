# Source: https://betterstack.com/community/guides/scaling-nodejs/vitejs-explained/
# Original language: javascript
# Normalized: js
# Block index: 21

[label src/main.js]
...
message.parentNode.insertBefore(logo, message);

message.textContent = "You just triggered HMR!";

[highlight]
// Log environment values
console.log("App name:", import.meta.env.VITE_APP_NAME);
console.log("API URL:", import.meta.env.VITE_API_URL);
[/highlight]
console.log("Vite HMR is active");