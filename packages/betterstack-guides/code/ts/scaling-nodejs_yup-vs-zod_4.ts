# Source: https://betterstack.com/community/guides/scaling-nodejs/yup-vs-zod/
# Original language: typescript
# Normalized: ts
# Block index: 4

const phoneField = yup.string()
  .when('method', {
    is: 'international',
    then: schema => schema.required('Phone required for international shipping')
      .matches(/^\+[1-9]\d{1,14}$/, 'Please enter phone with country code'),
    otherwise: schema => schema.optional()
  });