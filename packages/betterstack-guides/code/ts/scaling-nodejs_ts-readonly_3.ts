# Source: https://betterstack.com/community/guides/scaling-nodejs/ts-readonly/
# Original language: typescript
# Normalized: ts
# Block index: 3

[label src/mutation.ts]
interface UserConfig {
  theme: string;
  notifications: boolean;
}

function applyTheme(config: UserConfig) {
  config.theme = "dark";  // Accidental mutation
  return config;
}

const userConfig: UserConfig = {
  theme: "light",
  notifications: true
};

console.log("Before:", userConfig.theme);
applyTheme(userConfig);
console.log("After:", userConfig.theme);  // Unexpectedly changed!