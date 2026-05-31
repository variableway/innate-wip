# Source: https://betterstack.com/community/guides/scaling-nodejs/web-apis-with-hapijs/
# Original language: javascript
# Normalized: js
# Block index: 13

[label src/routes/posts.js]
import { postController } from '../controllers/postController.js';
import { createPostSchema } from '../utils/validation.js';

export const postRoutes = [
    {
        method: 'POST',
        path: '/api/posts',
        options: {
            validate: {
                payload: createPostSchema
            },
            tags: ['api', 'posts'],
            description: 'Create a new blog post'
        },
        handler: async (request, h) => {
            try {
                const post = await postController.createPost(request.payload);
                return h.response(post).code(201);
            } catch (error) {
                return error;
            }
        }
    }
];