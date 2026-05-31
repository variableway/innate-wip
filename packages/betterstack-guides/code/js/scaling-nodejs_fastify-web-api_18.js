# Source: https://betterstack.com/community/guides/scaling-nodejs/fastify-web-api/
# Original language: javascript
# Normalized: js
# Block index: 18

[label schemas/post.js]
// Previous schemas...

// Schema for getting a single post
const getPostSchema = {
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'string', format: 'uuid' }
    }
  },
  response: {
    200: postSchema,
    404: {
      type: 'object',
      properties: {
        error: { type: 'string' }
      }
    }
  }
};