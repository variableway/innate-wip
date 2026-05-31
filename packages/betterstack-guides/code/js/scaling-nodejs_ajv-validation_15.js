# Source: https://betterstack.com/community/guides/scaling-nodejs/ajv-validation/
# Original language: javascript
# Normalized: js
# Block index: 15

[label main.js]
...
[highlight]
const user = {
  name: "A",
  age: -5,
  email: "invalid-email"
};
[/highlight]
const valid = validate(user);
...