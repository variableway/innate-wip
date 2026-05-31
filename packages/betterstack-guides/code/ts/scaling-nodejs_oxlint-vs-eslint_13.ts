# Source: https://betterstack.com/community/guides/scaling-nodejs/oxlint-vs-eslint/
# Original language: typescript
# Normalized: ts
# Block index: 13

useEffect(() => {
  fetchUser(userId);
}, []); // ESLint warns: missing dependency 'userId'