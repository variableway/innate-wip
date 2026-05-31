# Source: https://betterstack.com/community/guides/scaling-nodejs/joi-explained/
# Original language: javascript
# Normalized: js
# Block index: 12

[label validation.js]
import Joi from 'joi';

const userSchema = Joi.object({
  username: Joi.string()
    ....
    }),
  email: Joi.string()
    ...
    }),
  age: Joi.number()
    ....
    }),
[highlight]
  role: Joi.string()
    .valid('user', 'admin', 'moderator')
    .default('user'),
  permissions: Joi.when('role', {
    is: 'admin',
    then: Joi.array().items(Joi.string()).min(1).required()
      .messages({
        'any.required': 'Permissions are required for admin users',
        'array.min': 'At least one permission is required for admin users'
      }),
    otherwise: Joi.forbidden()
  })
[/highlight]
});

export default userSchema;