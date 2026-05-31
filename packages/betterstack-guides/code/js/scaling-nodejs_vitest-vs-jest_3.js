# Source: https://betterstack.com/community/guides/scaling-nodejs/vitest-vs-jest/
# Original language: javascript
# Normalized: js
# Block index: 3

// Vitest mocking
vi.mock('node-fetch');
global.fetch = vi.fn(() => Promise.resolve({
  json: () => Promise.resolve({ id: 1 })
}));