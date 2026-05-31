# Source: https://betterstack.com/community/guides/scaling-nodejs/rspack-explained/
# Original language: javascript
# Normalized: js
# Block index: 5

[label src/index.js]
import './style.css';

const root = document.getElementById('root');
const header = document.createElement('h1');
header.textContent = 'Hello from Rspack!';

const message = document.createElement('p');
message.id = 'message';
message.textContent = 'Rspack is running and watching for changes!';

root.appendChild(header);
root.appendChild(message);

// Log a message to the console
console.log('Rspack HMR is active');