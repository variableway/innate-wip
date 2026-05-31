# Source: https://betterstack.com/community/guides/scaling-nodejs/web-apis-with-hapijs/
# Original language: javascript
# Normalized: js
# Block index: 12

[label src/controllers/postController.js]
import { Post } from '../models/Post.js';
import Boom from '@hapi/boom';

export const postController = {
    async createPost(payload) {
        try {
            const post = new Post(payload);
            await post.save();
            return post;
        } catch (error) {
            throw Boom.badImplementation('Failed to create post');
        }
    },

    async getAllPosts(query = {}) {
        try {
            const posts = await Post.find(query)
                .sort({ createdAt: -1 })
                .exec();
            return posts;
        } catch (error) {
            throw Boom.badImplementation('Failed to retrieve posts');
        }
    },

    async getPostById(id) {
        try {
            const post = await Post.findById(id);
            if (!post) {
                throw Boom.notFound('Post not found');
            }
            return post;
        } catch (error) {
            if (error.isBoom) throw error;
            throw Boom.badImplementation('Failed to retrieve post');
        }
    }
};