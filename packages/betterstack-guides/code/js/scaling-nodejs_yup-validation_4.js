# Source: https://betterstack.com/community/guides/scaling-nodejs/yup-validation/
# Original language: javascript
# Normalized: js
# Block index: 4

[label validation.js]
import * as yup from 'yup';

const userSchema = yup.object({
  username: yup.string().min(3).max(30).required(),
  email: yup.string().email().required(),
  age: yup.number().integer().min(18).required(),
});

export default userSchema;