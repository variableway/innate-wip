# Source: https://betterstack.com/community/guides/scaling-nodejs/nestjs-vs-fastify/
# Original language: javascript
# Normalized: js
# Block index: 14

[label posts.test.js]
const { test } = require('tap');
const { build } = require('./helper');

test('GET /posts returns list of posts', async (t) => {
  const app = await build(t);

  const res = await app.inject({ url: '/posts' });

  t.equal(res.statusCode, 200);
  t.equal(res.headers['content-type'], 'application/json; charset=utf-8');
  
  const posts = JSON.parse(res.payload);
  t.ok(Array.isArray(posts));
});

test('POST /posts creates new post', async (t) => {
  const app = await build(t);
  const payload = { title: 'Test Post', content: 'Test content' };

  const res = await app.inject({ method: 'POST', url: '/posts', payload });

  t.equal(res.statusCode, 201);
  const post = JSON.parse(res.payload);
  t.equal(post.title, payload.title);
});