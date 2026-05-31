# Source: https://betterstack.com/community/guides/scaling-nodejs/typebox-joi/
# Original language: typescript
# Normalized: ts
# Block index: 4

import Ajv from 'ajv';
const ajv = new Ajv();
const validate = ajv.compile(UserSchema);

if (validate(input)) {
  saveUser(input); // Data is valid
} else {
  console.log('Invalid data:', validate.errors);
}