# Source: https://betterstack.com/community/guides/scaling-nodejs/ajv-validation/
# Original language: javascript
# Normalized: js
# Block index: 22

[label main.js]
import Ajv from "ajv";
import addFormats from "ajv-formats";

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);  // Add format validators

[highlight]
// Custom password validation
ajv.addKeyword({
  keyword: "passwordComplexity",
  type: "string",
  validate: function(schema, data) {
    // Check for uppercase, lowercase, and number
    const hasUpperCase = /[A-Z]/.test(data);
    const hasLowerCase = /[a-z]/.test(data);
    const hasNumber = /[0-9]/.test(data);
    
    const valid = hasUpperCase && hasLowerCase && hasNumber;
    
    if (!valid) {
      validate.errors = [{
        keyword: "passwordComplexity",
        message: "Password must contain uppercase, lowercase, and number",
        params: { keyword: "passwordComplexity" }
      }];
    }
    
    return valid;
  }
});
[/highlight]

// Schema with custom keyword
const schema = {
  type: "object",
  properties: {
[highlight]
    username: { type: "string", minLength: 3, maxLength: 20 },
    password: { type: "string", minLength: 8, passwordComplexity: true }
[/highlight]
  },
[highlight]
  required: ["username", "password"],
[/highlight]
  additionalProperties: false
};

// Validate data
const validate = ajv.compile(schema);
[highlight]
const validUser = { username: "alice123", password: "Secure123" };
const valid = validate(validUser);
[/highlight]

if (valid) {
  console.log("User data is valid!");
} else {
  console.log("Validation errors:", validate.errors);
}