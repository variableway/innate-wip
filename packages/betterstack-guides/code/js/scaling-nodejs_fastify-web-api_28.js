# Source: https://betterstack.com/community/guides/scaling-nodejs/fastify-web-api/
# Original language: javascript
# Normalized: js
# Block index: 28

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

[highlight]
  // Get all posts with optional filtering
  fastify.get('/', { schema: getAllPostsSchema }, async (request, reply) => {
    try {
      const where = {};
      
      // Add published filter if provided
      if (request.query.published !== undefined) {
        where.published = request.query.published;
      }
      
      const posts = await prisma.post.findMany({
        where,
        orderBy: {
          createdAt: 'desc'
        }
      });
      
      return posts;
    } catch (error) {
      request.log.error('Error fetching posts:', error);
      reply.code(500).send({ error: 'Failed to fetch posts' });
    }
  });
[/highlight]
}

export default postRoutes;