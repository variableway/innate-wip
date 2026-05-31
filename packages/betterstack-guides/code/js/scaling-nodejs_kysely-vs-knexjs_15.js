# Source: https://betterstack.com/community/guides/scaling-nodejs/kysely-vs-knexjs/
# Original language: javascript
# Normalized: js
# Block index: 15

// Quick test setup
const knex = require('knex')({
  client: 'sqlite3',
  connection: { filename: ':memory:' },
  useNullAsDefault: true
});

// Test your queries
test('finds active users', async () => {
  await knex.schema.createTable('users', t => {
    t.increments(); t.boolean('active');
  });
  await knex('users').insert([{active: true}, {active: false}]);
  
  const users = await knex('users').where('active', true);
  expect(users.length).toBe(1);
});