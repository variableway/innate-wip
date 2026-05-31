# Source: https://betterstack.com/community/guides/scaling-nodejs/yup-vs-zod/
# Original language: typescript
# Normalized: ts
# Block index: 7

const passwordSchema = z.object({
  password: z.string().min(8),
  confirm: z.string()
}).refine(
  data => data.password === data.confirm,
  {
    message: 'Passwords must match',
    path: ['confirm']
  }
);