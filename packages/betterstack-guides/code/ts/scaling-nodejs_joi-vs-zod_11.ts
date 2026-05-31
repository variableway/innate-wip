# Source: https://betterstack.com/community/guides/scaling-nodejs/joi-vs-zod/
# Original language: typescript
# Normalized: ts
# Block index: 11

import { z } from 'zod';

const userSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  name: z.string(),
  age: z.number().min(18).optional()
});

type User = z.infer<typeof userSchema>;

function processUser(data: unknown): User {
  return userSchema.parse(data);
}