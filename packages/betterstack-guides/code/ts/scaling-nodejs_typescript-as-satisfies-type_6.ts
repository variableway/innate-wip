# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-as-satisfies-type/
# Original language: typescript
# Normalized: ts
# Block index: 6

[label excess-properties.ts]
interface Config {
  apiUrl: string;
  timeout: number;
}

const config1: Config = {
  apiUrl: "https://api.example.com",
  timeout: 5000,
  retires: 3 // Error: Did you mean 'retries'?
};

const config2 = {
  apiUrl: "https://api.example.com",
  timeout: 5000,
  retires: 3 // No error with assertion
} as Config;