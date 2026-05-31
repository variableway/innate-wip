# Source: https://betterstack.com/community/guides/scaling-nodejs/fastify-web-api/
# Original language: javascript
# Normalized: js
# Block index: 37

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

  // Get a specific post by ID
  fastify.get('/:id', { schema: getPostSchema }, async (request, reply) => {
    // ... existing code
  });

[highlight]
  // Update a specific post
  fastify.put('/:id', { schema: updatePostSchema }, async (request, reply) => {
    try {
      const { id } = request.params;
      const { title, content, published } = request.body;
      
      // First check if the post exists
      const existingPost = await prisma.post.findUnique({
        where: { id }
      });
      
      if (!existingPost) {
        reply.code(404).send({ error: `Post with ID ${id} not found` });
        return;
      }
      
      // Update the post
      const post = await prisma.post.update({
        where: { id },
        data: {
          title,
          content,
          published: published !== undefined ? published : existingPost.published
        }
      });
      
      return post;
    } catch (error) {
      request.log.error('Error updating post:', error);
      reply.code(500).send({ error: 'Failed to update post' });
    }
  });
[/highlight]
}

export default postRoutes;