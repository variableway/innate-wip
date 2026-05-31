# Source: https://betterstack.com/community/guides/scaling-nodejs/index/
# Original language: javascript
# Normalized: js
# Block index: 10

[label main.js]
...
[highlight]
const almostValidData = {
  name: "Alice",
  age: "30"  // Age is a string, not an integer
};

// Perform validation
const valid = validate(almostValidData);
[/highlight]

if (valid) {
  console.log("Data is valid!");
} else {
  console.log("Validation errors:", validate.errors);
}