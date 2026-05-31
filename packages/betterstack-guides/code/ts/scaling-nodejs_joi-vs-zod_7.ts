# Source: https://betterstack.com/community/guides/scaling-nodejs/joi-vs-zod/
# Original language: typescript
# Normalized: ts
# Block index: 7

const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
      message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    }),
  confirmPassword: z.string(),
  token: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
});

const userUpdateSchema = z.object({
  email: z.string().email().optional(),
  notificationPreferences: z.object({
    email: z.boolean().optional(),
    sms: z.boolean().optional(),
    phone: z.string().optional()
  }).transform(prefs => {
    if (prefs.sms && (!prefs.phone || !/^\+[1-9]\d{1,14}$/.test(prefs.phone))) {
      throw new Error('Valid phone number is required when SMS is enabled');
    }
    return prefs;
  })
});