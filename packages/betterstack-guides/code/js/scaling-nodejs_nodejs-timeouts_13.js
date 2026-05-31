# Source: https://betterstack.com/community/guides/scaling-nodejs/nodejs-timeouts/
# Original language: javascript
# Normalized: js
# Block index: 13

import got from 'got';

const data = await got('https://jsonplaceholder.typicode.com/posts', {
  headers: {
    Accept: 'application/json',
  },
  timeout: {
    request: 2000,
  },
}).json();