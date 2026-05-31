# Source: https://betterstack.com/community/guides/scaling-nodejs/nestjs-vs-express/
# Original language: javascript
# Normalized: js
# Block index: 13

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);