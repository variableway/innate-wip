# Source: https://betterstack.com/community/guides/scaling-nodejs/conditional-types/
# Original language: typescript
# Normalized: ts
# Block index: 21

[label src/advanced.ts]
// Extract the resolved type from a Promise
type Awaited<T> = T extends Promise<infer U> ? Awaited<U> : T;

// Extract array element type
type ElementType<T> = T extends (infer E)[] ? E : never;

// Extract nested object property types
type DeepValue<T, K extends string> = K extends `${infer First}.${infer Rest}`
  ? First extends keyof T
    ? DeepValue<T[First], Rest>
    : never
  : K extends keyof T
    ? T[K]
    : never;

// Test nested Promise unwrapping
type NestedPromise = Promise<Promise<Promise<number>>>;
type UnwrappedNumber = Awaited<NestedPromise>;

const value: UnwrappedNumber = 42;
console.log("Unwrapped value:", value);

// Test array element extraction
type NumberArray = number[];
type StringArray = string[];

type NumElement = ElementType<NumberArray>;
type StrElement = ElementType<StringArray>;

const num: NumElement = 42;
const str: StrElement = "hello";

console.log("Array elements:", num, str);

// Test deep property access
type User = {
  profile: {
    settings: {
      theme: "light" | "dark";
      notifications: boolean;
    };
  };
  posts: Array<{ title: string; views: number }>;
};

type Theme = DeepValue<User, "profile.settings.theme">;
type Notifications = DeepValue<User, "profile.settings.notifications">;

const theme: Theme = "dark";
const notifications: Notifications = true;

console.log("User preferences:", theme, notifications);