# Source: https://betterstack.com/community/guides/scaling-nodejs/typebox-vs-zod/
# Original language: typescript
# Normalized: ts
# Block index: 3

import { z } from 'zod'

const userSchema = z.object({
  email: z.string().email()
})

try {
  // Validate and get typed data
  const user = userSchema.parse(data)
  // Use user safely
} catch (error) {
  console.log(error.errors)
}