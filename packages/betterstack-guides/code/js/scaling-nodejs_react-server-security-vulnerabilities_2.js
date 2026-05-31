# Source: https://betterstack.com/community/guides/scaling-nodejs/react-server-security-vulnerabilities/
# Original language: javascript
# Normalized: js
# Block index: 2

// Simplified representation of the fix
const serverReferenceToString = () => {
  return "function () { [omitted code] }";
};

// When registering a server reference...
Object.defineProperty(reference, "toString", {
  value: serverReferenceToString,
});