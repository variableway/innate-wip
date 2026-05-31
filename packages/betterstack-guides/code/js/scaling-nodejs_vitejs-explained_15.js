# Source: https://betterstack.com/community/guides/scaling-nodejs/vitejs-explained/
# Original language: javascript
# Normalized: js
# Block index: 15

[label src/main.js]
import "./style.css";
[highlight]
import logoUrl from './assets/vite-logo.png';

// Create an image element
const logo = document.createElement('img');
logo.src = logoUrl;
logo.alt = 'Vite Logo';
logo.width = 100;

// Insert it before the message paragraph
const message = document.getElementById('message');
message.parentNode.insertBefore(logo, message);
[/highlight]

message.textContent = "You just triggered HMR!";

// Example: log a message to the console
console.log("Vite HMR is active");