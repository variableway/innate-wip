# Source: https://betterstack.com/community/guides/scaling-nodejs/yup-vs-zod/
# Original language: typescript
# Normalized: ts
# Block index: 0

import * as yup from 'yup';

const productSchema = yup.object({
  name: yup.string()
    .required('Product name is required')
    .min(3, 'Name must be at least 3 characters'),
  
  price: yup.number()
    .required('Price is required')
    .positive('Price must be positive'),
  
  // Additional fields...
});