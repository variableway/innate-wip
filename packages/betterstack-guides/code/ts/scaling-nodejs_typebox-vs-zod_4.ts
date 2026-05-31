# Source: https://betterstack.com/community/guides/scaling-nodejs/typebox-vs-zod/
# Original language: typescript
# Normalized: ts
# Block index: 4

const result = userSchema.safeParse(data)
if (result.success) {
  // Use result.data
} else {
  console.log(result.error)
}