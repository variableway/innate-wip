# Source: https://betterstack.com/community/guides/scaling-nodejs/fastify-web-api/
# Original language: javascript
# Normalized: js
# Block index: 22

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
    try {
      const { title, content, published = true } = request.body;
      
      const post = await prisma.post.create({
        data: {
          title,
          content,
          published
        }
      });
      
      reply.code(201).send(post);
    } catch (error) {
      request.log.error('Error creating post:', error);
      reply.code(500).send({ error: 'Failed to create post' });
    }
  });
}

export default postRoutes;