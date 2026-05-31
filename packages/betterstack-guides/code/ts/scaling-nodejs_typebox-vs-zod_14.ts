# Source: https://betterstack.com/community/guides/scaling-nodejs/typebox-vs-zod/
# Original language: typescript
# Normalized: ts
# Block index: 14

import { Type } from '@sinclair/typebox'
import Ajv from 'ajv'

const ajv = new Ajv()
const schema = Type.Object({ /* fields */ })
const validate = ajv.compile(schema)

// Ajv is very fast
function validateItem(item) {
  return validate(item)
}