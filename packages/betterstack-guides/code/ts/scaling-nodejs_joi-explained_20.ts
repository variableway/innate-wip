# Source: https://betterstack.com/community/guides/scaling-nodejs/joi-explained/
# Original language: typescript
# Normalized: ts
# Block index: 20

[label index.ts]
import { userSchema, type User } from './validation';

// TypeScript helps ensure we're creating a valid user
const userData: User = {
  username: 'johndoe',
  email: 'john.doe@example.com',
  age: 25,
  role: 'admin',
  permissions: ['read', 'write']
};

const result = userSchema.validate(userData);

if (result.error) {
  console.error('Validation error:', result.error.message);
} else {
  // After validation, we know result.value is a valid User
  const validUser: User = result.value;
  console.log('Valid user data:', validUser);
}