# Source: https://betterstack.com/community/guides/scaling-nodejs/nestjs-vs-express/
# Original language: javascript
# Normalized: js
# Block index: 14

const User = require('../models/User');

const createUser = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Failed to create user' });
  }
};

module.exports = { createUser };