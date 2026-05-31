# Source: https://betterstack.com/community/guides/scaling-nodejs/react2shell_react_server/
# Original language: javascript
# Normalized: js
# Block index: 8

[label Vulnerable path traversal]
for (let i = 1; i < path.length; i++) {
  // Blindly traverses the path, allowing access to __proto__
  value = value[path[i]];
}