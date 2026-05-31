# Source: https://betterstack.com/community/guides/scaling-nodejs/joi-vs-zod/
# Original language: typescript
# Normalized: ts
# Block index: 10

import Joi from 'joi';

const userSchema = Joi.object({
  id: Joi.number().required(),
  email: Joi.string().email().required(),
  name: Joi.string().required(),
  age: Joi.number().min(18).optional()
});

interface User {
  id: number;
  email: string;
  name: string;
  age?: number;
}

function processUser(data: unknown): User {
  const { error, value } = userSchema.validate(data);

  if (error) {
    throw new Error(`Invalid user data: ${error.message}`);
  }

  return value as User;
}