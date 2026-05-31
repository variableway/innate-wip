# Source: https://betterstack.com/community/guides/scaling-nodejs/knex-vs-prisma/
# Original language: javascript
# Normalized: js
# Block index: 21

// Setting up a test database with Knex
const knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: ':memory:'  // In-memory SQLite for tests
  },
  useNullAsDefault: true
});

// Jest example
beforeAll(async () => {
  // Run migrations on test database
  await knex.migrate.latest();
});

afterAll(async () => {
  await knex.destroy();
});

beforeEach(async () => {
  // Clear data between tests
  await knex('posts').truncate();
  await knex('users').truncate();
});

test('creates a user', async () => {
  const [userId] = await knex('users').insert({
    name: 'Test User',
    email: 'test@example.com'
  }).returning('id');
  
  const user = await knex('users').where({ id: userId }).first();
  expect(user).toMatchObject({
    name: 'Test User',
    email: 'test@example.com'
  });
});