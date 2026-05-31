# Source: https://betterstack.com/community/guides/scaling-nodejs/web-apis-with-hapijs/
# Original language: javascript
# Normalized: js
# Block index: 19

[label src/routes/posts.js]
import { postController } from '../controllers/postController.js';
[highlight]
import { createPostSchema, postParamsSchema } from '../utils/validation.js';
import Joi from 'joi';
[/highlight]

export const postRoutes = [
    // Previous POST route...

[highlight]
    {
        method: 'GET',
        path: '/api/posts',
        options: {
            validate: {
                query: Joi.object({
                    published: Joi.string().valid('true', 'false')
                })
            },
            tags: ['api', 'posts'],
            description: 'Get all blog posts with optional filtering'
        },
        handler: async (request, h) => {
            try {
                const posts = await postController.getAllPosts(request.query);
                return posts;
            } catch (error) {
                return error;
            }
        }
    },

    {
        method: 'GET',
        path: '/api/posts/{id}',
        options: {
            validate: {
                params: postParamsSchema
            },
            tags: ['api', 'posts'],
            description: 'Get a specific blog post by ID'
        },
        handler: async (request, h) => {
            try {
                const post = await postController.getPostById(request.params.id);
                return post;
            } catch (error) {
                return error;
            }
        }
    }
[/highlight]
];