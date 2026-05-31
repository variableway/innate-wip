# Source: https://betterstack.com/community/guides/scaling-nodejs/joi-vs-zod/
# Original language: typescript
# Normalized: ts
# Block index: 0

const Joi = require('joi');

const userSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
  email: Joi.string().email().required(),
  name: Joi.string().min(2).max(100),
  role: Joi.string().valid('admin', 'user', 'guest').default('user'),
  tags: Joi.array().items(Joi.string()),
  metadata: Joi.object().unknown(true)
});

const { error, value } = userSchema.validate({
  id: 1,
  email: 'user@example.com',
  name: 'John Doe',
  tags: ['developer']
});

if (error) {
  console.error(error.message);
} else {
  console.log(value);
}