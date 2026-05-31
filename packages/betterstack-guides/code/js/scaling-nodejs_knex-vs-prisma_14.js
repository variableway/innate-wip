# Source: https://betterstack.com/community/guides/scaling-nodejs/knex-vs-prisma/
# Original language: javascript
# Normalized: js
# Block index: 14

// Create a migration
npx knex migrate:make add_user_settings

// In the generated file:
exports.up = function(knex) {
  return knex.schema.table('users', table => {
    table.jsonb('settings').defaultTo('{}');
    table.boolean('email_notifications').defaultTo(true);
  });
};

exports.down = function(knex) {
  return knex.schema.table('users', table => {
    table.dropColumn('settings');
    table.dropColumn('email_notifications');
  });
};

// Apply migrations
npx knex migrate:latest