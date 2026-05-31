# Source: https://betterstack.com/community/guides/scaling-nodejs/joi-explained/
# Original language: typescript
# Normalized: ts
# Block index: 19

[label validation.ts]
import Joi from 'joi';

const userSchema = Joi.object({
  ...
});

[highlight]
// Define a TypeScript interface that matches the schema
interface User {
  username: string;
  email: string;
  age: number;
  role?: 'user' | 'admin' | 'moderator';
  permissions?: string[];
}

export { userSchema, type User };
[/highlight]