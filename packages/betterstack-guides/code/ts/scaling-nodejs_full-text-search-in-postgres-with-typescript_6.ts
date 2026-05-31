# Source: https://betterstack.com/community/guides/scaling-nodejs/full-text-search-in-postgres-with-typescript/
# Original language: typescript
# Normalized: ts
# Block index: 6

[label drizzle.config.ts]
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/db/schema.ts',
  out: './src/db/migrations',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});