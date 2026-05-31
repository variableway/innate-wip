# Source: https://betterstack.com/community/guides/scaling-nodejs/nodejs-errors/
# Original language: javascript
# Normalized: js
# Block index: 3

const response = await axios.get(
  'https://example.com',
  {
    [highlight]
    timeout: 5000, // 5 seconds
    [/highlight]
  }
);