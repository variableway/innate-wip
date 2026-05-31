# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-as-satisfies-type/
# Original language: typescript
# Normalized: ts
# Block index: 2

[label basic-satisfies.ts]
const config = {
  apiUrl: "https://api.example.com",
  timeout: 5000,
  retries: 3
} satisfies Config;

// TypeScript preserves literal types
config.apiUrl; // Type: "https://api.example.com" (not string)
config.timeout; // Type: 5000 (not number)