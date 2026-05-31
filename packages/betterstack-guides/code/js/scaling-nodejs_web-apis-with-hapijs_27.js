# Source: https://betterstack.com/community/guides/scaling-nodejs/web-apis-with-hapijs/
# Original language: javascript
# Normalized: js
# Block index: 27

[label src/routes/posts.js]
import { postController } from '../controllers/postController.js';
[highlight]
import { 
    createPostSchema, 
    updatePostSchema, 
    postParamsSchema 
} from '../utils/validation.js';
[/highlight]
import Joi from 'joi';

export const postRoutes = [
    // Previous routes...

[highlight]
    {
        method: 'PUT',
        path: '/api/posts/{id}',
        options: {
            validate: {
                params: postParamsSchema,
                payload: updatePostSchema
            },
            tags: ['api', 'posts'],
            description: 'Update a specific blog post'
        },
        handler: async (request, h) => {
            try {
                const post = await postController.updatePost(
                    request.params.id, 
                    request.payload
                );
                return post;
            } catch (error) {
                return error;
            }
        }
    }
[/highlight]
];