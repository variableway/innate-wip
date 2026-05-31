# Source: https://betterstack.com/community/guides/scaling-nodejs/yup-vs-zod/
# Original language: typescript
# Normalized: ts
# Block index: 6

const shippingSchema = z.object({
  // Fields definition...
}).superRefine((data, ctx) => {
  // Conditional validation for international shipping
  if (data.method === 'international' && (!data.phone || data.phone.length === 0)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Phone required for international shipping',
      path: ['phone']
    });
  }
});