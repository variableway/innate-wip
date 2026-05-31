# Source: https://betterstack.com/community/guides/scaling-nodejs/knexjs-explained/
# Original language: javascript
# Normalized: js
# Block index: 3

[label database.js]
import knex from 'knex';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a Knex instance with SQLite configuration
const db = knex({
  client: 'sqlite3',
  connection: {
    filename: path.join(__dirname, 'bookstore.sqlite')
  },
  useNullAsDefault: true, // SQLite-specific setting
  debug: true // Shows queries in console (disable in production)
});

// Function to test the database connection
async function testConnection() {
  try {
    const result = await db.raw('SELECT 1+1 AS result');
    console.log('Database connection established successfully');
    return result;
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
}

export { db, testConnection };