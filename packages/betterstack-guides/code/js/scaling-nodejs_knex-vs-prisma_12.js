# Source: https://betterstack.com/community/guides/scaling-nodejs/knex-vs-prisma/
# Original language: javascript
# Normalized: js
# Block index: 12

// Getting a user with their posts
const rows = await knex('users')
  .where('users.id', userId)
  .join('posts', 'users.id', 'posts.author_id')
  .select('users.*', 'posts.id as post_id', 'posts.title');

// You need to restructure the flat results yourself
const user = {
  id: rows[0].id,
  name: rows[0].name,
  posts: rows.map(row => ({
    id: row.post_id,
    title: row.title
  }))
};

// Or make separate queries
const user = await knex('users').where('id', userId).first();
const posts = await knex('posts').where('author_id', userId);
user.posts = posts;