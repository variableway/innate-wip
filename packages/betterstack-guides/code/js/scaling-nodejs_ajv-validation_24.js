# Source: https://betterstack.com/community/guides/scaling-nodejs/ajv-validation/
# Original language: javascript
# Normalized: js
# Block index: 24

[label main.js]
...
[highlight]
const invalidUser = {
  username: "bob456",
  password: "weakpass"
};
const valid = validate(invalidUser);
[/highlight]
if (valid) {
  console.log("User data is valid!");
} else {
  console.log("Validation errors:", validate.errors);
}