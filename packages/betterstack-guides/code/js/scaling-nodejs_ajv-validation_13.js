# Source: https://betterstack.com/community/guides/scaling-nodejs/ajv-validation/
# Original language: javascript
# Normalized: js
# Block index: 13

[label main.js]
import Ajv from "ajv";
[highlight]
import addFormats from "ajv-formats";

const ajv = new Ajv({ allErrors: true });
addFormats(ajv); // Add format validators
[/highlight]

// Schema with rules
const schema = {
  type: "object",
  properties: {
[highlight]
    name: { type: "string", minLength: 2, maxLength: 50 },
    age: { type: "integer", minimum: 1, maximum: 120 },
    email: { type: "string", format: "email" }
[/highlight]
  },
[highlight]
  required: ["name", "age", "email"],
[/highlight]
  additionalProperties: false
};

// Validate data
const validate = ajv.compile(schema);
[highlight]
const user = { name: "Alice", age: 30, email: "alice@example.com" };
const valid = validate(user);
[/highlight]

if (valid) {
  console.log("Data is valid!");
} else {
  console.log("Validation errors:", validate.errors);
}