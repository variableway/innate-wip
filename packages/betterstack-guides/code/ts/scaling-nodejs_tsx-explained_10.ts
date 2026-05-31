# Source: https://betterstack.com/community/guides/scaling-nodejs/tsx-explained/
# Original language: typescript
# Normalized: ts
# Block index: 10

[label src/utils/formatter.ts]
export const formatMessage = (message: string, prefix: string = 'LOG'): string => {
  return `[${prefix}] ${new Date().toISOString()} - ${message}`;
};

export const formatObject = <T>(obj: T): string => {
  return JSON.stringify(obj, null, 2);
};