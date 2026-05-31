# Source: https://betterstack.com/community/guides/scaling-nodejs/nodejs-timeouts/
# Original language: javascript
# Normalized: js
# Block index: 12

const response = await axios.get(
  'https://jsonplaceholder.typicode.com/posts',
  {
    headers: {
      Accept: 'application/json',
    },
    timeout: 2000, // timeout after 2 seconds
  }
);