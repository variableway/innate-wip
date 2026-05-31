# Source: https://betterstack.com/community/guides/scaling-nodejs/typebox-joi/
# Original language: javascript
# Normalized: js
# Block index: 0

const productSchema = Joi.object({
  name: Joi.string().min(2).required(),
  price: Joi.number().positive().precision(2),
  tags: Joi.array().items(Joi.string())
});

const result = productSchema.validate(someData);