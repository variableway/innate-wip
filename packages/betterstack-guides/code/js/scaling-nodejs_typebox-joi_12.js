# Source: https://betterstack.com/community/guides/scaling-nodejs/typebox-joi/
# Original language: javascript
# Normalized: js
# Block index: 12

// Express + Joi using celebrate middleware
app.post('/users', celebrate({
  body: userSchema
}), createUser);