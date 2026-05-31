# Source: https://betterstack.com/community/guides/scaling-nodejs/drizzle-orm/
# Original language: typescript
# Normalized: ts
# Block index: 13

[label drizzle.config.ts]
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema/*",
  dialect: "sqlite",
  dbCredentials: {
    url: "./drizzle.db"
  }
});