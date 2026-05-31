# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-as-satisfies-type/
# Original language: typescript
# Normalized: ts
# Block index: 27

[label runtime-knowledge.ts]
function getStoredValue(key: string) {
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) as UserPreferences : null;
}