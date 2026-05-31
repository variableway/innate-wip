# Source: https://betterstack.com/community/guides/scaling-nodejs/react2shell_react_server/
# Original language: javascript
# Normalized: js
# Block index: 9

[label Patched path traversal]
for (let i = 1; i < path.length; i++) {
[highlight]
  // Check if the property is an OWN property of the object
  if (!Object.prototype.hasOwnProperty.call(value, path[i])) {
    // If it's not (e.g., it's __proto__), throw an error
    throw new Error("Invalid reference: property does not exist.");
  }
[/highlight]
  // Only proceed if the check passes
  value = value[path[i]];
}