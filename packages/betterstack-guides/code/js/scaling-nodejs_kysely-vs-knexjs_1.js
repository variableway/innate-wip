# Source: https://betterstack.com/community/guides/scaling-nodejs/kysely-vs-knexjs/
# Original language: javascript
# Normalized: js
# Block index: 1

// knexfile.js
module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user: 'username',
      password: 'password'
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }
};

// Using it in your app
const knex = require('knex')(require('./knexfile').development);