# Source: https://betterstack.com/community/guides/scaling-nodejs/kysely-vs-knexjs/
# Original language: javascript
# Normalized: js
# Block index: 9

// migrations/20230501_create_users.js
exports.up = function(knex) {
  return knex.schema.createTable('users', table => {
    table.increments('id').primary();
    table.string('username', 50).unique();
    table.boolean('active').defaultTo(true);
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('users');
};