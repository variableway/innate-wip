# Source: https://betterstack.com/community/guides/scaling-nodejs/ajv-validation/
# Original language: javascript
# Normalized: js
# Block index: 20

// Data without isActive
const user = {
  name: "Charlie",
  age: 28,
  email: "charlie@example.com"
};

// After validation
console.log("User with defaults:", user);