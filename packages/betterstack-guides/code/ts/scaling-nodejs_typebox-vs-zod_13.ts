# Source: https://betterstack.com/community/guides/scaling-nodejs/typebox-vs-zod/
# Original language: typescript
# Normalized: ts
# Block index: 13

import { initTRPC } from '@trpc/server'
import { z } from 'zod'

const t = initTRPC.create()

const appRouter = t.router({
  createUser: t.procedure
    .input(z.object({
      username: z.string(),
      email: z.string().email()
    }))
    .mutation(({ input }) => {
      // Create user with typed input
    })
})