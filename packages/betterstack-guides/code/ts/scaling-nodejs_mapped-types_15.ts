# Source: https://betterstack.com/community/guides/scaling-nodejs/mapped-types/
# Original language: typescript
# Normalized: ts
# Block index: 15

[label src/conditional.ts]
[highlight]
// Make only function properties optional using mapped type modifiers
type OptionalMethods<T> = {
  [K in keyof T as T[K] extends Function ? K : never]?: T[K];
} & {
  [K in keyof T as T[K] extends Function ? never : K]: T[K];
};
[/highlight]

// Convert Date properties to ISO strings
type SerializeDates<T> = {
  [K in keyof T]: T[K] extends Date ? string : T[K];
};

...