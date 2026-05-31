# Source: https://betterstack.com/community/guides/scaling-nodejs/typebox-vs-zod/
# Original language: typescript
# Normalized: ts
# Block index: 10

import { z } from 'zod'

const userSchema = z.object({
  id: z.number(),
  email: z.string(),
  age: z.number().optional()
})

// Generate TypeScript type
type User = z.infer<typeof userSchema>