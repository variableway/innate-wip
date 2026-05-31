# Source: https://betterstack.com/community/guides/scaling-nodejs/oxlint-vs-eslint/
# Original language: javascript
# Normalized: js
# Block index: 29

// Warning: potential object injection
function getUserData(req) {
  const key = req.params.key;
  return users[key]; // Unsafe if key is '__proto__' or 'constructor'
}

// Error: ReDoS vulnerability
const regex = /(a+)+b/; // Catastrophic backtracking