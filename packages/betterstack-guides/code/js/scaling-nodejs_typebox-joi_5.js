# Source: https://betterstack.com/community/guides/scaling-nodejs/typebox-joi/
# Original language: javascript
# Normalized: js
# Block index: 5

const orderSchema = Joi.object({
  type: Joi.string().valid('standard', 'express').required(),
  items: Joi.array().min(1).required(),
  insurance: Joi.when('type', {
    is: 'express',
    then: Joi.boolean().required(),
    otherwise: Joi.boolean().optional()
  })
});