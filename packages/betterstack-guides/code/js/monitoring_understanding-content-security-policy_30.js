# Source: https://betterstack.com/community/guides/monitoring/understanding-content-security-policy/
# Original language: javascript
# Normalized: js
# Block index: 30

const nonce = generateRandomNonce();
// Include the nonce in your CSP header
// Then inject it into your SPA initialization
document.getElementById('app').innerHTML = `<div nonce="${nonce}">App content</div>`;