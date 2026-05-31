# Source: https://betterstack.com/community/guides/scaling-nodejs/joi-explained/
# Original language: javascript
# Normalized: js
# Block index: 7

[label validation.js]
import Joi from 'joi';

const userSchema = Joi.object({
[highlight]
  username: Joi.string().alphanum().min(3).max(30).required().messages({
    'string.min': 'Username must have at least 3 characters',
    'string.max': 'Username cannot exceed 30 characters',
    'string.empty': 'Username cannot be empty',
    'any.required': 'Username is required',
  }),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required',
    }),
  age: Joi.number().integer().min(18).required().messages({
    'number.base': 'Age must be a number',
    'number.integer': 'Age must be an integer',
    'number.min': 'You must be at least 18 years old',
    'any.required': 'Age is required',
  }),
[/highlight]
});

export default userSchema;