# Source: https://betterstack.com/community/guides/scaling-nodejs/index/
# Original language: javascript
# Normalized: js
# Block index: 6

[label main.js]
import Ajv from "ajv";
const ajv = new Ajv();

// Define a schema
const schema = {
  type: "object",
  properties: {
    name: { type: "string" },
    age: { type: "integer" }
  },
  required: ["name", "age"],
  additionalProperties: false
};

// Validate data
const validate = ajv.compile(schema);
const validData = { name: "Alice", age: 30 };
const valid = validate(validData);

if (valid) {
  console.log("Data is valid!");
} else {
  console.log("Validation errors:", validate.errors);
}