# Source: https://betterstack.com/community/guides/scaling-nodejs/nodejs-sqlite/
# Original language: javascript
# Normalized: js
# Block index: 1

import { DatabaseSync } from 'node:sqlite';

// Create an in-memory database
const memoryDb = new DatabaseSync(':memory:');

// Or create a file-based database
const fileDb = new DatabaseSync('path/to/database.db');