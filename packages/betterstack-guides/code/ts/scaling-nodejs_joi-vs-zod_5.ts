# Source: https://betterstack.com/community/guides/scaling-nodejs/joi-vs-zod/
# Original language: typescript
# Normalized: ts
# Block index: 5

function processLoginSafe(data: unknown) {
  const result = loginSchema.safeParse(data);

  if (result.success) {
    return { success: true, user: result.data };
  } else {
    const formattedErrors = result.error.errors.map(err => ({
      field: err.path.join('.'),
      message: err.message
    }));

    return { success: false, errors: formattedErrors };
  }
}