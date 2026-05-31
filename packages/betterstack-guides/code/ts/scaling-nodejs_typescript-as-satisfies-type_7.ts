# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-as-satisfies-type/
# Original language: typescript
# Normalized: ts
# Block index: 7

[label validation-better.ts]
import { z } from 'zod';

const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email()
});

// Type assertion: no runtime safety
const user1 = await response.json() as User;

// Runtime validation: catches actual data issues
const data = await response.json();
const user2 = UserSchema.parse(data);