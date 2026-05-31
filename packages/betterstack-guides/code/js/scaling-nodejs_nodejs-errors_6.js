# Source: https://betterstack.com/community/guides/scaling-nodejs/nodejs-errors/
# Original language: javascript
# Normalized: js
# Block index: 6

// Incorrect use
const options = {
  host: 'http://example.com/path/to/resource',
};

// Correct use
const options = {
  host: 'example.com',
  path: '/path/to/resource',
};

http.request(options, (res) => {});