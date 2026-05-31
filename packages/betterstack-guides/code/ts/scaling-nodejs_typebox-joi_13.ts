# Source: https://betterstack.com/community/guides/scaling-nodejs/typebox-joi/
# Original language: typescript
# Normalized: ts
# Block index: 13

// Fastify with TypeBox
app.post<{ Body: UserType }>('/users', {
  schema: { body: UserSchema },
  handler: createUser
});