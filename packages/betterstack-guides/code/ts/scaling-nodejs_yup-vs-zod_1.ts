# Source: https://betterstack.com/community/guides/scaling-nodejs/yup-vs-zod/
# Original language: typescript
# Normalized: ts
# Block index: 1

import { z } from 'zod';

const productSchema = z.object({
  name: z.string()
    .min(3, 'Name must be at least 3 characters'),
  
  price: z.number()
    .positive('Price must be positive'),
  
  // Additional fields...
});

type Product = z.infer<typeof productSchema>;