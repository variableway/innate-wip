# Source: https://betterstack.com/community/guides/scaling-nodejs/express-web-api/
# Original language: javascript
# Normalized: js
# Block index: 20

[label routes/posts.js]
import express from 'express';
import Post from '../models/post.js';
import { validatePost, validatePostQuery, validatePostId } from '../validators/post.js';

const router = express.Router();

// Create a new post
router.post('/', validatePost, async (req, res) => {
  // ... existing code
});

[highlight]
// Get all posts with optional filtering
router.get('/', validatePostQuery, async (req, res) => {
  try {
    const where = {};
    
    // Add published filter if provided
    if (req.query.published !== undefined) {
      where.published = req.query.published;
    }
    
    const posts = await Post.findAll({ 
      where,
      order: [['created_at', 'DESC']]
    });
    
    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});
[/highlight]
export default router;