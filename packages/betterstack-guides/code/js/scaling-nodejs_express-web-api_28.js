# Source: https://betterstack.com/community/guides/scaling-nodejs/express-web-api/
# Original language: javascript
# Normalized: js
# Block index: 28

[label routes/posts.js]
// ... existing imports and routes

// Get a specific post by ID
router.get('/:id', validatePostId, async (req, res) => {
  // ... existing code
});

[highlight]
// Update a specific post
router.put('/:id', validatePostId, validatePost, async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    
    if (!post) {
      return res.status(404).json({ error: `Post with ID ${req.params.id} not found` });
    }
    
    // Update post fields
    post.title = req.body.title;
    post.content = req.body.content;
    
    // Only update published status if provided
    if (req.body.published !== undefined) {
      post.published = req.body.published;
    }
    
    await post.save();
    
    res.json(post);
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ error: 'Failed to update post' });
  }
});
[/highlight]

export default router;