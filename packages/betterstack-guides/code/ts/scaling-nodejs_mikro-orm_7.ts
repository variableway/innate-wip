# Source: https://betterstack.com/community/guides/scaling-nodejs/mikro-orm/
# Original language: typescript
# Normalized: ts
# Block index: 7

[label src/create-tables.ts]
import { MikroORM } from '@mikro-orm/core';
import { Book } from './entities/Book';
import config from '../mikro-orm.config';

// Make sure reflect-metadata is imported at the entry point
import 'reflect-metadata';

async function createTables() {
  try {
    // Initialize MikroORM
    const orm = await MikroORM.init(config);
    
    // Get the schema generator
    const generator = orm.getSchemaGenerator();
    
    // Drop existing tables if they exist and create them fresh
    await generator.dropSchema();
    await generator.createSchema();
    
    console.log('Database tables created successfully!');
    
    // Close the connection
    await orm.close(true);
  } catch (error) {
    console.error('Error creating tables:', error);
  }
}

createTables();