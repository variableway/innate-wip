# Source: https://betterstack.com/community/guides/scaling-nodejs/yup-validation/
# Original language: javascript
# Normalized: js
# Block index: 13

[label index.js]
import userSchema from './validation.js';

// Test various user scenarios
async function testValidations() {
  const testCases = [
    {
      label: "Admin without permissions",
      data: {
        username: "admin_user",
        email: "admin@example.com",
        age: 30,
        role: "admin"
        // Missing permissions
      }
    },
    {
      label: "Regular user with permissions",
      data: {
        username: "regular_user",
        email: "user@example.com",
        age: 25,
        role: "user",
        permissions: ["read"] // Not allowed for regular users
      }
    },
    {
      label: "Valid admin",
      data: {
        username: "valid_admin",
        email: "valid.admin@example.com",
        age: 35,
        role: "admin",
        permissions: ["read", "write", "delete"]
      }
    }
  ];

  for (const testCase of testCases) {
    console.log(`\nTesting: ${testCase.label}`);
    try {
      const validData = await userSchema.validate(testCase.data, { abortEarly: false });
      console.log("✓ Valid");
    } catch (error) {
      console.log("✗ Invalid");
      error.inner.forEach(err => {
        console.log(`  - ${err.path}: ${err.message}`);
      });
    }
  }
}

testValidations();