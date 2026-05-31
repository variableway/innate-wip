# Source: https://betterstack.com/community/guides/scaling-nodejs/joi-vs-zod/
# Original language: typescript
# Normalized: ts
# Block index: 3

const asyncSchema = Joi.object({
  username: Joi.string().external(async (value) => {
    const exists = await checkUserExists(value);
    if (exists) throw new Error('Username already taken');
    return value;
  })
});

asyncSchema.validateAsync({ username: 'newuser' })
  .then(value => console.log('Valid:', value))
  .catch(err => console.error('Invalid:', err.message));