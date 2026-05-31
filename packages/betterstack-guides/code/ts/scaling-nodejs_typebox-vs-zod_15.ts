# Source: https://betterstack.com/community/guides/scaling-nodejs/typebox-vs-zod/
# Original language: typescript
# Normalized: ts
# Block index: 15

import { z } from 'zod'

const schema = z.object({ /* fields */ })

function validateItem(item) {
  return schema.safeParse(item)
}