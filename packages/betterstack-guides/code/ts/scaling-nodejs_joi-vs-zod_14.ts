# Source: https://betterstack.com/community/guides/scaling-nodejs/joi-vs-zod/
# Original language: typescript
# Normalized: ts
# Block index: 14

import Joi from 'joi';

const schema = Joi.object({
  /* schema definition */
}).options({
  abortEarly: true,
  cache: true
});

function validateMany(items) {
  return items.map(item => schema.validate(item));
}