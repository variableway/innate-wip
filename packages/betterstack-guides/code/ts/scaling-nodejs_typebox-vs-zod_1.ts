# Source: https://betterstack.com/community/guides/scaling-nodejs/typebox-vs-zod/
# Original language: typescript
# Normalized: ts
# Block index: 1

import { z } from 'zod'

const userSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  name: z.string().min(2)
})

// Get TypeScript type
type User = z.infer<typeof userSchema>