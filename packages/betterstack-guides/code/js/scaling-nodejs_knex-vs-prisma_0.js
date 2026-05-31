# Source: https://betterstack.com/community/guides/scaling-nodejs/knex-vs-prisma/
# Original language: javascript
# Normalized: js
# Block index: 0

// Install packages
npm install knex pg

// knexfile.js - your configuration
module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user: 'username',
      password: 'password'
    },
    migrations: {
      directory: './migrations'
    }
  }
};

// In your app
const knex = require('knex')(require('./knexfile').development);