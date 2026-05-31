# Source: https://betterstack.com/community/guides/scaling-nodejs/knex-vs-prisma/
# Original language: javascript
# Normalized: js
# Block index: 22

const testWithTransaction = async (callback) => {
  const trx = await knex.transaction();
  try {
    await callback(trx);
  } finally {
    await trx.rollback();
  }
};

test('creates related records', async () => {
  await testWithTransaction(async (trx) => {
    const [userId] = await trx('users')
      .insert({ name: 'Test User', email: 'test@example.com' })
      .returning('id');
      
    await trx('posts').insert({
      title: 'Test Post',
      author_id: userId
    });
    
    const posts = await trx('posts')
      .join('users', 'posts.author_id', 'users.id')
      .where('users.email', 'test@example.com')
      .select('posts.*');
      
    expect(posts).toHaveLength(1);
    expect(posts[0].title).toBe('Test Post');
  });
});