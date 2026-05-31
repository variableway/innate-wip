# Source: https://betterstack.com/community/guides/scaling-nodejs/joi-vs-zod/
# Original language: typescript
# Normalized: ts
# Block index: 4

import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  rememberMe: z.boolean().default(false)
});

type LoginData = z.infer<typeof loginSchema>;

function processLogin(data: unknown) {
  try {
    const validData = loginSchema.parse(data);
    return { success: true, user: validData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }));
      return { success: false, errors: formattedErrors };
    }
    throw error;
  }
}