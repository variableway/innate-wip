# Source: https://betterstack.com/community/guides/scaling-nodejs/joi-vs-zod/
# Original language: typescript
# Normalized: ts
# Block index: 1

import { z } from 'zod';

const userSchema = z.object({
  id: z.number().int().positive(),
  email: z.string().email(),
  name: z.string().min(2).max(100).optional(),
  role: z.enum(['admin', 'user', 'guest']).default('user'),
  tags: z.array(z.string()).optional(),
  metadata: z.record(z.string(), z.any()).optional()
});

type User = z.infer<typeof userSchema>;

try {
  const user = userSchema.parse({
    id: 1,
    email: 'user@example.com',
    name: 'John Doe',
    tags: ['developer']
  });

  console.log(user);
} catch (error) {
  console.error(error);
}