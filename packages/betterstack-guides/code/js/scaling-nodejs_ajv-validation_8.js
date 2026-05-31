# Source: https://betterstack.com/community/guides/scaling-nodejs/ajv-validation/
# Original language: javascript
# Normalized: js
# Block index: 8

[label main.js]
....
// Data to validate
[highlight]
const invalidData = {
  name: "Alice",
  age: "thirty"
};

// Perform validation
const valid = validate(invalidData);
[/highlight]

if (valid) {
  console.log("Data is valid!");
} else {
  console.log("Validation errors:", validate.errors);
}