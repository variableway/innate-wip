# Source: https://betterstack.com/community/guides/scaling-nodejs/sequelize-orm/
# Original language: javascript
# Normalized: js
# Block index: 5

[label create-tables.js]
import { sequelize, testConnection } from './database.js';
import Book from './models/book.js';

async function createTables() {
  try {
    // Test the database connection
    await testConnection();
    
    // Sync all models with the database
    // force: true will drop tables if they exist
    await sequelize.sync({ force: true });
    
    console.log('Database tables created successfully!');
  } catch (error) {
    console.error('Error creating tables:', error);
  } finally {
    // Close the database connection
    await sequelize.close();
  }
}

createTables();