# Source: https://betterstack.com/community/guides/scaling-nodejs/kysely-vs-knexjs/
# Original language: typescript
# Normalized: ts
# Block index: 17

// Type-safe test setup
const db = new Kysely<TestDB>({
  dialect: new SqliteDialect({ database: new SQLite(':memory:') })
});

// Your typed test
test('finds active users', async () => {
  await db.schema
    .createTable('users')
    .addColumn('id', 'integer', c => c.primaryKey())
    .addColumn('active', 'boolean')
    .execute();
    
  await db.insertInto('users').values([
    {id: 1, active: true},
    {id: 2, active: false}
  ]).execute();
  
  const users = await db.selectFrom('users')
    .where('active', '=', true)
    .selectAll()
    .execute();
    
  expect(users.length).toBe(1);
});