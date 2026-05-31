# Source: https://betterstack.com/community/guides/scaling-nodejs/typebox-vs-zod/
# Original language: typescript
# Normalized: ts
# Block index: 12

import fastify from 'fastify'
import { Type } from '@sinclair/typebox'

const app = fastify()

app.post('/users', {
  schema: {
    body: Type.Object({
      username: Type.String(),
      email: Type.String({ format: 'email' })
    })
  }
}, (request, reply) => {
  // Handler with typed request body
})