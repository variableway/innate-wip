# Source: https://betterstack.com/community/guides/scaling-nodejs/joi-vs-zod/
# Original language: typescript
# Normalized: ts
# Block index: 15

import { z } from 'zod';

const schema = z.object({
  /* schema definition */
});

function validateMany(items) {
  return items.map(item => schema.safeParse(item));
}