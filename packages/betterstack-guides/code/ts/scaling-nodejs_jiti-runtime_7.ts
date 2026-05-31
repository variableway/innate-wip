# Source: https://betterstack.com/community/guides/scaling-nodejs/jiti-runtime/
# Original language: typescript
# Normalized: ts
# Block index: 7

[label esm-module.ts]
// ESM TypeScript module
export interface DatabaseConfig {
  host: string;
  port: number;
}

export interface ApiConfig {
  version: string;
  timeout: number;
}

export const defaultSettings = {
  environment: 'development',
  debug: true
};