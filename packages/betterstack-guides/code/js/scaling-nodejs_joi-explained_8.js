# Source: https://betterstack.com/community/guides/scaling-nodejs/joi-explained/
# Original language: javascript
# Normalized: js
# Block index: 8

[label index.js]
import userSchema from './validation.js';

[highlight]
const invalidUserData = {
  username: 'j',  // Too short
  email: 'not-an-email',  // Invalid format
  age: 16  // Under 18
};

const result = userSchema.validate(invalidUserData);
[/highlight]

if (result.error) {
  console.error('Validation error:', result.error.message);
} else {
  console.log('Valid user data:', result.value);
}