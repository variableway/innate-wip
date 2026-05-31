# Source: https://betterstack.com/community/guides/scaling-nodejs/typebox-vs-zod/
# Original language: typescript
# Normalized: ts
# Block index: 5

import { Type } from '@sinclair/typebox'
import Ajv from 'ajv'

const ajv = new Ajv()

// Add custom password check
ajv.addKeyword({
  keyword: 'passwordStrength',
  validate: (schema, password) => {
    return /[A-Z]/.test(password) && 
           /[a-z]/.test(password) && 
           /[0-9]/.test(password)
  }
})

const PasswordSchema = Type.Object({
  password: Type.String({ 
    minLength: 8,
    passwordStrength: true 
  })
})