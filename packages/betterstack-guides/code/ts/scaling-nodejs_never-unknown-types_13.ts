# Source: https://betterstack.com/community/guides/scaling-nodejs/never-unknown-types/
# Original language: typescript
# Normalized: ts
# Block index: 13

[label src/complete-example.ts]
[highlight]
type ApiStatus = 'success' | 'error' | 'pending';
[/highlight]

// Keep the same handleApiResponse function...