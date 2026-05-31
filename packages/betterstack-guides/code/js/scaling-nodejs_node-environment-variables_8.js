# Source: https://betterstack.com/community/guides/scaling-nodejs/node-environment-variables/
# Original language: javascript
# Normalized: js
# Block index: 8

[label app.js]
const port = process.env.PORT || 3000;
const apiKey = process.env.API_KEY || 'default-key';

console.log('Server port:', port);
console.log('API key:', apiKey);