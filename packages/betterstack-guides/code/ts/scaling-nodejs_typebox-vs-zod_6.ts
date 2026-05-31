# Source: https://betterstack.com/community/guides/scaling-nodejs/typebox-vs-zod/
# Original language: typescript
# Normalized: ts
# Block index: 6

import { z } from 'zod'

const passwordSchema = z.string()
  .min(8)
  .refine(password => {
    const hasUpper = /[A-Z]/.test(password)
    const hasLower = /[a-z]/.test(password)
    const hasNumber = /[0-9]/.test(password)
    return hasUpper && hasLower && hasNumber
  }, { message: "Password too weak" })