# Source: https://betterstack.com/community/guides/scaling-nodejs/typebox-joi/
# Original language: typescript
# Normalized: ts
# Block index: 9

import Joi from 'joi';

// Validation schema
const userSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email(),
  age: Joi.number().min(18)
});

// Separate TypeScript interface
interface User {
  name: string;
  email: string;
  age: number;
}

function processUser(data: unknown): User {
  const { error, value } = userSchema.validate(data);
  if (error) throw error;
  return value as User;
}