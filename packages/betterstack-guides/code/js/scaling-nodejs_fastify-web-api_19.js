# Source: https://betterstack.com/community/guides/scaling-nodejs/fastify-web-api/
# Original language: javascript
# Normalized: js
# Block index: 19

[label schemas/post.js]
// Previous schemas...

// Schema for updating a post
const updatePostSchema = {
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'string', format: 'uuid' }
    }
  },
  body: {
    type: 'object',
    required: ['title', 'content'],
    properties: {
      title: { 
        type: 'string', 
        minLength: 3, 
        maxLength: 100 
      },
      content: { 
        type: 'string', 
        minLength: 10 
      },
      published: { 
        type: 'boolean' 
      }
    },
    additionalProperties: false
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