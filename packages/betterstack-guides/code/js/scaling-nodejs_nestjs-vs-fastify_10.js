# Source: https://betterstack.com/community/guides/scaling-nodejs/nestjs-vs-fastify/
# Original language: javascript
# Normalized: js
# Block index: 10

[label server.js]
await fastify.register(require('@fastify/postgres'), {
  connectionString: 'postgres://user:pass@localhost/db'
});

fastify.decorate('createPost', async function(postData) {
  const client = await this.pg.connect();
  try {
    const { rows } = await client.query(
      'INSERT INTO posts (title, content) VALUES ($1, $2) RETURNING *',
      [postData.title, postData.content]
    );
    return rows[0];
  } finally {
    client.release();
  }
});

fastify.post('/posts', {
  schema: { body: createPostSchema }
}, async (request, reply) => {
  const post = await fastify.createPost(request.body);
  reply.code(201);
  return post;
});