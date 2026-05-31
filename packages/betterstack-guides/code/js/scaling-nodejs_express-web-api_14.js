# Source: https://betterstack.com/community/guides/scaling-nodejs/express-web-api/
# Original language: javascript
# Normalized: js
# Block index: 14

[label routes/posts.js]
import express from 'express';
import Post from '../models/post.js';
import { validatePost, validatePostQuery, validatePostId } from '../validators/post.js';

const router = express.Router();

// Create a new post
router.post('/', validatePost, async (req, res) => {
  try {
    const post = await Post.create({
      title: req.body.title,
      content: req.body.content,
      published: req.body.published
    });
    
    res.status(201).json(post);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

export default router;