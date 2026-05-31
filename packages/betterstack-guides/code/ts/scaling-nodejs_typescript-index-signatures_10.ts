# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-index-signatures/
# Original language: typescript
# Normalized: ts
# Block index: 10

[label src/mixed.ts]
interface AppConfig {
  version: string;
  debug: boolean;
  [setting: string]: string | boolean;
}

const config: AppConfig = {
  version: "1.0.0",
  debug: true,
  theme: "dark",
  apiTimeout: "5000"
};

function getSetting(key: string): string | boolean {
  return config[key];
}

console.log("Version:", config.version);
console.log("Theme:", getSetting("theme"));
console.log("Debug:", config.debug);