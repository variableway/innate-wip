# Source: https://betterstack.com/community/guides/scaling-nodejs/knexjs-explained/
# Original language: javascript
# Normalized: js
# Block index: 4

[label schema.js]
import { db, testConnection } from './database.js';

async function createSchema() {
  try {
    // Test the connection first
    await testConnection();
    
    // Check if the books table already exists
    const tableExists = await db.schema.hasTable('books');
    
    if (tableExists) {
      console.log('Books table already exists, dropping it...');
      await db.schema.dropTable('books');
    }
    
    // Create the books table
    await db.schema.createTable('books', (table) => {
      table.increments('id').primary();
      table.string('title', 200).notNullable();
      table.string('author', 100).notNullable();
      table.decimal('price', 10, 2);
      table.integer('stock').unsigned().defaultTo(0);
      table.timestamps(true, true); // Creates created_at and updated_at columns
    });
    
    console.log('Books table created successfully!');
  } catch (error) {
    console.error('Error creating schema:', error);
  } finally {
    // Close the database connection
    await db.destroy();
  }
}

// Run the function
createSchema();