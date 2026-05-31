# Source: https://betterstack.com/community/guides/scaling-nodejs/knex-vs-prisma/
# Original language: javascript
# Normalized: js
# Block index: 10

// Using the callback approach
await knex.transaction(async trx => {
  // Create a user and get their ID
  const [userId] = await trx('users')
    .insert({ name: 'Alice', email: 'alice@example.com' })
    .returning('id');
  
  // Create a post for this user
  await trx('posts').insert({
    title: 'First Post',
    author_id: userId
  });
  
  // Auto-commits if successful, rolls back on error
});

// Or the manual approach
const trx = await knex.transaction();
try {
  const [userId] = await trx('users')
    .insert({ name: 'Bob', email: 'bob@example.com' })
    .returning('id');
  
  await trx('posts').insert({ title: 'Bob\'s Post', author_id: userId });
  await trx.commit();
} catch (error) {
  await trx.rollback();
  throw error;
}