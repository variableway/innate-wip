# Source: https://betterstack.com/community/guides/scaling-nodejs/rspack-explained/
# Original language: javascript
# Normalized: js
# Block index: 14

[label src/index.js]
import './style.scss';
[highlight]
import logoUrl from './assets/rspack-logo.png';
[/highlight]

const root = document.getElementById('root');

[highlight]
// Create the logo element
const logo = document.createElement('img');
logo.src = logoUrl;
logo.alt = 'Rspack Logo';
logo.width = 100;
[/highlight]

const header = document.createElement('h1');
header.textContent = 'Hello from Rspack!';

const message = document.createElement('p');
message.id = 'message';
message.textContent = 'You just triggered HMR!';

[highlight]
root.appendChild(logo);
[/highlight]
root.appendChild(header);
root.appendChild(message);

// Log a message to the console
console.log('Rspack HMR is active');