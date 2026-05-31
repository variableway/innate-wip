# Source: https://betterstack.com/community/guides/scaling-nodejs/express-web-api/
# Original language: javascript
# Normalized: js
# Block index: 23

[label routes/posts.js]
// ... existing code

// Get all posts with optional filtering
router.get('/', validatePostQuery, async (req, res) => {
  // ... existing code
});

[highlight]
// Get a specific post by ID
router.get('/:id', validatePostId, async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    
    if (!post) {
      return res.status(404).json({ error: `Post with ID ${req.params.id} not found` });
    }
    
    res.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ error: 'Failed to fetch post' });
  }
});
[/highlight]
export default router;