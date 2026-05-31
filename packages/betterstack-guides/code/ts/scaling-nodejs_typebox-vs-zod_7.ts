# Source: https://betterstack.com/community/guides/scaling-nodejs/typebox-vs-zod/
# Original language: typescript
# Normalized: ts
# Block index: 7

const usernameSchema = z.string().refineAsync(
  async (name) => {
    const isTaken = await checkDatabase(name)
    return !isTaken
  },
  { message: "Username already taken" }
)