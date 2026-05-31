# Source: https://betterstack.com/community/guides/scaling-nodejs/joi-vs-zod/
# Original language: typescript
# Normalized: ts
# Block index: 9

const usernameSchema = z.string().refine(
  async (username) => {
    const exists = await checkUserExists(username);
    return !exists;
  },
  { message: 'Username already taken' }
);

async function validateUsername(username: string) {
  try {
    await usernameSchema.parseAsync(username);
    return { valid: true };
  } catch (error) {
    return { valid: false, error };
  }
}