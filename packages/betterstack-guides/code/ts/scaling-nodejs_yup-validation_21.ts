# Source: https://betterstack.com/community/guides/scaling-nodejs/yup-validation/
# Original language: typescript
# Normalized: ts
# Block index: 21

[label index.ts]
[highlight]
import { userSchema, type User } from './validation';

// TypeScript knows the shape of a valid user from the schema
const userData: User = {
  username: 'johndoe',
  email: 'john.doe@example.com',
  age: 25,
  role: 'admin',
  permissions: ['read', 'write']
};
[/highlight]

async function inspectErrors() {
  try {
[highlight]
    // TypeScript knows the validated data will be a valid User
    const validUser: User = await userSchema.validate(userData);
    console.log('Valid user data:', validUser);
[/highlight]
  } catch (error) {
[highlight]
    if (error instanceof Error) {
      console.error('Validation error:', error.message);
    }
[/highlight]
  }
}

inspectErrors();