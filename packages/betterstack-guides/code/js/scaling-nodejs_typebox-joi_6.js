# Source: https://betterstack.com/community/guides/scaling-nodejs/typebox-joi/
# Original language: javascript
# Normalized: js
# Block index: 6

const schema = Joi.string().custom((value, helpers) => {
  if (isBlacklisted(value)) {
    return helpers.error('string.forbidden');
  }
  return value;
});