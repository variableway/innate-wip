# Source: https://betterstack.com/community/guides/scaling-nodejs/typebox-vs-zod/
# Original language: typescript
# Normalized: ts
# Block index: 9

const ResponseSchema = Type.Union([
  Type.Object({
    success: Type.Literal(true),
    data: UserSchema
  }),
  Type.Object({
    success: Type.Literal(false),
    error: Type.String()
  })
])

type Response = Static<typeof ResponseSchema>