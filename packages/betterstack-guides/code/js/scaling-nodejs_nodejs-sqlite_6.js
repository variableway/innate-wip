# Source: https://betterstack.com/community/guides/scaling-nodejs/nodejs-sqlite/
# Original language: javascript
# Normalized: js
# Block index: 6

[label data/model.js]
import { DatabaseSync } from 'node:sqlite';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create a file-based database
const database = new DatabaseSync(`${__dirname}/bookstore.db`);

// Initialize database schema
const initDatabase = `
CREATE TABLE IF NOT EXISTS books (
  book_id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  isbn TEXT UNIQUE,
  published_year INTEGER,
  genre TEXT,
  price REAL NOT NULL,
  in_stock INTEGER DEFAULT 1,
  created_at INTEGER NOT NULL
);
`;

// Execute schema creation
database.exec(initDatabase);

export default database;