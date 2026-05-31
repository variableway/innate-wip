# Source: https://betterstack.com/community/guides/scaling-nodejs/drizzle-orm/
# Original language: typescript
# Normalized: ts
# Block index: 10

[label src/db/index.ts]
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

// Handle ESM vs CommonJS directory path differences
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a SQLite database connection
const sqlite = new Database(path.join(__dirname, '../../drizzle.db'));

// Create a Drizzle instance with the SQLite connection
export const db = drizzle(sqlite);

// Test the connection
export function testConnection() {
  try {
    const result = sqlite.prepare('SELECT 1 + 1 AS result').get();
    console.log('Connection has been established successfully.');
    console.log('Test query result:', result);
    return true;
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    return false;
  }
}