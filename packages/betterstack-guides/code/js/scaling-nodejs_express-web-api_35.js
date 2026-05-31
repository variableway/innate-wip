# Source: https://betterstack.com/community/guides/scaling-nodejs/express-web-api/
# Original language: javascript
# Normalized: js
# Block index: 35

[label routes/posts.js]
// ... existing imports and routes

// Update a specific post
router.put('/:id', validatePostId, validatePost, async (req, res) => {
  // ... existing code
});

[highlight]
// Delete a specific post
router.delete('/:id', validatePostId, async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    
    if (!post) {
      return res.status(404).json({ error: `Post with ID ${req.params.id} not found` });
    }
    
    await post.destroy();
    
    // Return 204 No Content on successful deletion
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Failed to delete post' });
  }
});
[/highlight]

export default router;