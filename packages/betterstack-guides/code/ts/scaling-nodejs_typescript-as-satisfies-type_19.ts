# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-as-satisfies-type/
# Original language: typescript
# Normalized: ts
# Block index: 19

[label config-pattern.ts]
type EnvConfig = {
  database: {
    host: string;
    port: number;
  };
  features: Record<string, boolean>;
};

const config = {
  database: {
    host: "localhost",
    port: 5432
  },
  features: {
    auth: true,
    analytics: false
  }
} satisfies EnvConfig;

// Access with preserved literal types
config.database.port; // Type: 5432
config.features.auth; // Type: true