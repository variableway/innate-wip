# Source: https://betterstack.com/community/guides/scaling-nodejs/fastify-web-api/
# Original language: javascript
# Normalized: js
# Block index: 32

[label routes/posts.js]
import { prisma } from '../utils/db.js';
import {
  createPostSchema,
  getAllPostsSchema,
  getPostSchema,
  updatePostSchema,
  deletePostSchema
} from '../schemas/post.js';

// Define the posts routes plugin
async function postRoutes(fastify, options) {
  // Create a new post
  fastify.post('/', { schema: createPostSchema }, async (request, reply) => {
    // ... existing code
  });

  // Get all posts with optional filtering
  fastify.get('/', { schema: getAllPostsSchema }, async (request, reply) => {
    // ... existing code
  });

[highlight]
  // Get a specific post by ID
  fastify.get('/:id', { schema: getPostSchema }, async (request, reply) => {
    try {
      const post = await prisma.post.findUnique({
        where: { id: request.params.id }
      });
      
      if (!post) {
        reply.code(404).send({ 
          error: `Post with ID ${request.params.id} not found` 
        });
        return;
      }
      
      return post;
    } catch (error) {
      request.log.error('Error fetching post:', error);
      reply.code(500).send({ error: 'Failed to fetch post' });
    }
  });
[/highlight]
}

export default postRoutes;