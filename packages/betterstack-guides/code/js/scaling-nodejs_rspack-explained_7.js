# Source: https://betterstack.com/community/guides/scaling-nodejs/rspack-explained/
# Original language: javascript
# Normalized: js
# Block index: 7

[label src/index.js]
...
const message = document.createElement('p');
message.id = 'message';
[highlight]
message.textContent = 'You just triggered HMR!';
[/highlight]

root.appendChild(header);
root.appendChild(message);

// Log a message to the console
console.log('Rspack HMR is active');