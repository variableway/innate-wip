# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-index-signatures/
# Original language: typescript
# Normalized: ts
# Block index: 13

[label src/mixed.ts]
interface AppConfig {
  version: string;
  debug: boolean;
[highlight]
  port: number;  // Error: number not compatible with string | boolean
[/highlight]
  [setting: string]: string | boolean;
}
...