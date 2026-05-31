# Source: https://betterstack.com/community/guides/scaling-nodejs/passport-js-with-express/
# Original language: javascript
# Normalized: js
# Block index: 22

[label routes/auth.js]
import express from 'express';
import passport from 'passport';
import User from '../models/user.js';

const router = express.Router();

// Registration endpoint
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
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

[highlight]
// Login endpoint
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return res.status(500).json({ error: 'Authentication error' });
    }
    
    if (!user) {
      return res.status(401).json({ error: info.message || 'Login failed' });
    }
    
    req.logIn(user, (err) => {
      if (err) {
        return res.status(500).json({ error: 'Login error' });
      }
      
      res.json({
        message: 'Login successful',
        user: { id: user.id, username: user.username }
      });
    });
  })(req, res, next);
});
[/highlight]

export default router;