# Source: https://betterstack.com/community/guides/scaling-nodejs/joi-vs-zod/
# Original language: typescript
# Normalized: ts
# Block index: 6

const resetPasswordSchema = Joi.object({
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .required()
    .messages({
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    }),
  confirmPassword: Joi.string().required(),
  token: Joi.string().required()
}).custom((value, helpers) => {
  if (value.password !== value.confirmPassword) {
    return helpers.error('passwords.mismatch');
  }
  return value;
}).messages({
  'passwords.mismatch': 'Passwords do not match'
});

const userUpdateSchema = Joi.object({
  email: Joi.string().email(),
  notificationPreferences: Joi.object({
    email: Joi.boolean(),
    sms: Joi.boolean(),
    phone: Joi.string().when('sms', {
      is: true,
      then: Joi.string().pattern(/^\+[1-9]\d{1,14}$/).required(),
      otherwise: Joi.string().optional()
    })
  })
});