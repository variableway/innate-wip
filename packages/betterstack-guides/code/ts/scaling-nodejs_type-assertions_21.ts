# Source: https://betterstack.com/community/guides/scaling-nodejs/type-assertions/
# Original language: typescript
# Normalized: ts
# Block index: 21

[label src/const.ts]
// Without const assertion
const config1 = {
  host: "localhost",
  port: 3000,
  enabled: true
};

// TypeScript infers: { host: string; port: number; enabled: boolean }
// Properties are mutable

// With const assertion
const config2 = {
  host: "localhost",
  port: 3000,
  enabled: true
} as const;

// TypeScript infers: { readonly host: "localhost"; readonly port: 3000; readonly enabled: true }
// Properties are readonly with literal types

console.log(config1.host); // Type: string
console.log(config2.host); // Type: "localhost"

// Try to mutate
config1.host = "127.0.0.1"; // Works
config2.host = "127.0.0.1"; // Error!