# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-module-resolution/
# Original language: typescript
# Normalized: ts
# Block index: 4

[label src/utils/formatter.ts]
export function formatMessage(message: string): string {
  return `[INFO] ${message}`;
}

export function formatError(error: string): string {
  return `[ERROR] ${error}`;
}