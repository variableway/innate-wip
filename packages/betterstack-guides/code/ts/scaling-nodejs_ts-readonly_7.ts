# Source: https://betterstack.com/community/guides/scaling-nodejs/ts-readonly/
# Original language: typescript
# Normalized: ts
# Block index: 7

[label src/mutation.ts]
interface UserConfig {
[highlight]
  readonly theme: string;
  readonly notifications: boolean;
[/highlight]
}

function applyTheme(config: UserConfig) {
  config.theme = "dark";  // Accidental mutation
  return config;
}
...