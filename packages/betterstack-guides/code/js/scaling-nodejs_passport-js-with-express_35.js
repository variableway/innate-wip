# Source: https://betterstack.com/community/guides/scaling-nodejs/passport-js-with-express/
# Original language: javascript
# Normalized: js
# Block index: 35

[label routes/auth.js]
// ... existing imports and routes

// Login endpoint
router.post('/login', (req, res, next) => {
  // ... existing login code
});

[highlight]
// Logout endpoint
router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout error' });
    }
    res.json({ message: 'Logout successful' });
  });
});

// Profile endpoint (protected route example)
router.get('/profile', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  
  res.json({
    message: 'Profile data',
    user: { id: req.user.id, username: req.user.username }
  });
});
[/highlight]

export default router;