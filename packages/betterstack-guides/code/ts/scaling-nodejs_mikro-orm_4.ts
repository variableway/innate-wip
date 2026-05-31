# Source: https://betterstack.com/community/guides/scaling-nodejs/mikro-orm/
# Original language: typescript
# Normalized: ts
# Block index: 4

[label mikro-orm.config.ts]
import { defineConfig } from '@mikro-orm/core';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { SqliteDriver } from '@mikro-orm/sqlite';
import path from 'path';

const config = defineConfig({
  entities: ['./dist/entities'], // path to compiled entity classes
  entitiesTs: ['./src/entities'], // path to TypeScript entity sources
  dbName: path.join(process.cwd(), 'database.sqlite'),
  driver: SqliteDriver,
  metadataProvider: TsMorphMetadataProvider, // Using ts-morph reflection provider
  migrations: {
    path: './dist/migrations',
    pathTs: './src/migrations',
  },
  debug: true, // set to false in production
});

export default config;