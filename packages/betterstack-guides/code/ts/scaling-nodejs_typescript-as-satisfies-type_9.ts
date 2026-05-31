# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-as-satisfies-type/
# Original language: typescript
# Normalized: ts
# Block index: 9

[label widening-example.ts]
type Config = {
  environment: "development" | "staging" | "production";
  port: number;
  features: string[];
};

// With annotation, types are widened
const config1: Config = {
  environment: "development",
  port: 3000,
  features: ["auth", "api"]
};

config1.environment; // Type: "development" | "staging" | "production"
config1.port; // Type: number
config1.features; // Type: string[]

// With satisfies, literal types are preserved
const config2 = {
  environment: "development",
  port: 3000,
  features: ["auth", "api"]
} satisfies Config;

config2.environment; // Type: "development"
config2.port; // Type: 3000
config2.features; // Type: ["auth", "api"]