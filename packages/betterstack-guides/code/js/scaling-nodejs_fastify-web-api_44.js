# Source: https://betterstack.com/community/guides/scaling-nodejs/fastify-web-api/
# Original language: javascript
# Normalized: js
# Block index: 44

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

  ...
  // Update a specific post
  fastify.put('/:id', { schema: updatePostSchema }, async (request, reply) => {
    // ... existing code
  });

[highlight]
  // Delete a specific post
  fastify.delete('/:id', { schema: deletePostSchema }, async (request, reply) => {
    try {
      const { id } = request.params;
      
      // First check if the post exists
      const existingPost = await prisma.post.findUnique({
        where: { id }
      });
      
      if (!existingPost) {
        reply.code(404).send({ error: `Post with ID ${id} not found` });
        return;
      }
      
      // Delete the post
      await prisma.post.delete({
        where: { id }
      });
      
      // Return 204 No Content on successful deletion
      reply.code(204).send();
    } catch (error) {
      request.log.error('Error deleting post:', error);
      reply.code(500).send({ error: 'Failed to delete post' });
    }
  });
[/highlight]
}

export default postRoutes;