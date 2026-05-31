# Source: https://betterstack.com/community/guides/scaling-nodejs/vitest-vs-jest/
# Original language: javascript
# Normalized: js
# Block index: 2

// Jest mocking
jest.mock('node-fetch');
global.fetch = jest.fn(() => Promise.resolve({
  json: () => Promise.resolve({ id: 1 })
}));