# Source: https://betterstack.com/community/guides/scaling-nodejs/passport-js-with-express/
# Original language: javascript
# Normalized: js
# Block index: 21

[label routes/auth.js]
import express from 'express';
import passport from 'passport';
import User from '../models/user.js';

const router = express.Router();

[highlight]
// Registration endpoint
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Create new user (password will be hashed automatically)
    const user = await User.create({ username, password });
    
    res.status(201).json({ 
      message: 'User created successfully',
      user: { id: user.id, username: user.username }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});
[/highlight]

export default router;