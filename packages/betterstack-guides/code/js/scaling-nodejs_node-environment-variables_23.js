# Source: https://betterstack.com/community/guides/scaling-nodejs/node-environment-variables/
# Original language: javascript
# Normalized: js
# Block index: 23

[label app.js]
import dotenv from 'dotenv';

dotenv.config();

console.log('Server port:', process.env.PORT);
console.log('API key:', process.env.API_KEY);
console.log('Database URL:', process.env.DATABASE_URL);