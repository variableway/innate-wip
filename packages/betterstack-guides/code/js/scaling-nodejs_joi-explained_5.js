# Source: https://betterstack.com/community/guides/scaling-nodejs/joi-explained/
# Original language: javascript
# Normalized: js
# Block index: 5

[label index.js]
import userSchema from './validation.js';

const userData = {
  username: 'johndoe',
  email: 'john.doe@example.com',
  age: 25
};

const result = userSchema.validate(userData);

if (result.error) {
  console.error('Validation error:', result.error.message);
} else {
  console.log('Valid user data:', result.value);
}