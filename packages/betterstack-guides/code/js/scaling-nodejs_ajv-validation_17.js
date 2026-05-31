# Source: https://betterstack.com/community/guides/scaling-nodejs/ajv-validation/
# Original language: javascript
# Normalized: js
# Block index: 17

[label main.js]
const schema = {
  type: "object",
  properties: {
    name: { type: "string", minLength: 2, maxLength: 50 },
    age: { type: "integer", minimum: 1, maximum: 120 },
    email: { type: "string", format: "email" },
[highlight]
    isActive: { type: "boolean", default: true }
[/highlight]
  },
[highlight]
  required: ["name", "age"],  // Email is now optional
[/highlight]
  additionalProperties: false
};

...
const validate = ajv.compile(schema);
// Data without email
[highlight]
const user = {
  name: "Bob",
  age: 25
};
[/highlight]
...