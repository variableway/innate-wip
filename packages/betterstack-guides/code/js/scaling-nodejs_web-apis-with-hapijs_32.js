# Source: https://betterstack.com/community/guides/scaling-nodejs/web-apis-with-hapijs/
# Original language: javascript
# Normalized: js
# Block index: 32

[label src/controllers/postController.js]
import { Post } from '../models/Post.js';
import Boom from '@hapi/boom';

export const postController = {
    // Previous methods...

[highlight]
    async deletePost(id) {
        try {
            const post = await Post.findByIdAndDelete(id);
            
            if (!post) {
                throw Boom.notFound('Post not found');
            }
            
            return { message: 'Post deleted successfully', deletedPost: post };
        } catch (error) {
            if (error.isBoom) throw error;
            if (error.name === 'CastError') {
                throw Boom.badRequest('Invalid post ID format');
            }
            throw Boom.badImplementation('Failed to delete post');
        }
    }
[/highlight]
};