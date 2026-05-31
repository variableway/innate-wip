# Source: https://betterstack.com/community/guides/scaling-nodejs/husky-and-lint-staged/
# Original language: javascript
# Normalized: js
# Block index: 12

[label src/utils.js]
export function formatUserName(firstName, lastName) {
  return `${firstName} ${lastName}`;
}

export function calculateAge(birthYear) {
  const currentYear = new Date().getFullYear();
  return currentYear - birthYear;
}