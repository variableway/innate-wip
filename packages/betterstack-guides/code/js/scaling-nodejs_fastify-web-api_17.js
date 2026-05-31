# Source: https://betterstack.com/community/guides/scaling-nodejs/fastify-web-api/
# Original language: javascript
# Normalized: js
# Block index: 17

[label schemas/post.js]
// Previous schemas...

// Schema for getting all posts
const getAllPostsSchema = {
  querystring: {
    type: 'object',
    properties: {
      published: { type: 'boolean' }
    }
  },
  response: {
    200: {
      type: 'array',
      items: postSchema
    }
  }
};