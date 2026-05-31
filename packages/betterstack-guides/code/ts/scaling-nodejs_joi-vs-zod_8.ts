# Source: https://betterstack.com/community/guides/scaling-nodejs/joi-vs-zod/
# Original language: typescript
# Normalized: ts
# Block index: 8

const usernameSchema = Joi.string().external(async (value) => {
  const exists = await checkUserExists(value);
  if (exists) throw new Error('Username already taken');
  return value;
});