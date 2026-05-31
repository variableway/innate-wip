# Source: https://betterstack.com/community/guides/scaling-nodejs/nodejs-sqlite/
# Original language: javascript
# Normalized: js
# Block index: 2

import { DatabaseSync } from 'node:sqlite';

const db = new DatabaseSync(':memory:');

// Create a table using exec()
db.exec(`
  CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    published_year INTEGER,
    genre TEXT,
    in_stock INTEGER DEFAULT 1
  )
`);

// Insert data using a prepared statement
const insertStmt = db.prepare(`
  INSERT INTO books (title, author, published_year, genre)
  VALUES (?, ?, ?, ?)
`);

// Execute the prepared statement with run()
insertStmt.run('Dune', 'Frank Herbert', 1965, 'Science Fiction');

// Query data with a prepared statement
const queryStmt = db.prepare('SELECT * FROM books WHERE genre = ?');
const scifiBooks = queryStmt.all('Science Fiction');

console.log(scifiBooks);