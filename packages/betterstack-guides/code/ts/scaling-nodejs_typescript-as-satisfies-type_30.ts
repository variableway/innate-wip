# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-as-satisfies-type/
# Original language: typescript
# Normalized: ts
# Block index: 30

[label config-satisfies.ts]
const apiConfig = {
  endpoints: {
    users: "/api/users",
    posts: "/api/posts"
  },
  timeout: 5000,
  retries: 3
} satisfies APIConfig;