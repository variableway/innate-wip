# Source: https://betterstack.com/community/guides/scaling-nodejs/fastify-web-api/
# Original language: javascript
# Normalized: js
# Block index: 16

[label schemas/post.js]
// Schema for post objects returned in responses
const postSchema = {
  // ... previous code
};

[highlight]
// Schema for creating a new post
const createPostSchema = {
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
        type: 'boolean',
        default: true
      }
    },
    additionalProperties: false
  },
  response: {
    201: postSchema
  }
};
[/highlight]