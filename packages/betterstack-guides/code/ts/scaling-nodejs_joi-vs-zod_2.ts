# Source: https://betterstack.com/community/guides/scaling-nodejs/joi-vs-zod/
# Original language: typescript
# Normalized: ts
# Block index: 2

import Joi from 'joi';

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  rememberMe: Joi.boolean().default(false)
});

function processLogin(data: unknown) {
  const { error, value } = loginSchema.validate(data, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    const formattedErrors = error.details.map(err => ({
      field: err.path.join('.'),
      message: err.message
    }));

    return { success: false, errors: formattedErrors };
  }

  return { success: true, user: value };
}