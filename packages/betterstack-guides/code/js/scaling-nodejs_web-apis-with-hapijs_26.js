# Source: https://betterstack.com/community/guides/scaling-nodejs/web-apis-with-hapijs/
# Original language: javascript
# Normalized: js
# Block index: 26

[label src/controllers/postController.js]
import { Post } from '../models/Post.js';
import Boom from '@hapi/boom';

export const postController = {
    // Previous methods...

[highlight]
    async updatePost(id, payload) {
        try {
            const post = await Post.findByIdAndUpdate(
                id,
                payload,
                { new: true, runValidators: true }
            );
            
            if (!post) {
                throw Boom.notFound('Post not found');
            }
            
            return post;
        } catch (error) {
            if (error.isBoom) throw error;
            if (error.name === 'CastError') {
                throw Boom.badRequest('Invalid post ID format');
            }
            if (error.name === 'ValidationError') {
                throw Boom.badRequest(error.message);
            }
            throw Boom.badImplementation('Failed to update post');
        }
    }
[/highlight]
};