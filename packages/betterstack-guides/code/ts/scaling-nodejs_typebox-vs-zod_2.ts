# Source: https://betterstack.com/community/guides/scaling-nodejs/typebox-vs-zod/
# Original language: typescript
# Normalized: ts
# Block index: 2

import { Type } from '@sinclair/typebox'
import Ajv from 'ajv'

const UserSchema = Type.Object({
  email: Type.String({ format: 'email' })
})

const ajv = new Ajv()
const validate = ajv.compile(UserSchema)

// Check data
const valid = validate(data)
if (!valid) {
  console.log(validate.errors)
}