# Source: https://betterstack.com/community/guides/scaling-nodejs/full-text-search-in-postgres-with-typescript/
# Original language: typescript
# Normalized: ts
# Block index: 4

[label src/db/index.ts]
import { drizzle } from 'drizzle-orm/bun-sql';

export const db = drizzle(process.env.DATABASE_URL!);