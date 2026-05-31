# Source: https://betterstack.com/community/guides/scaling-nodejs/passport-js-with-express/
# Original language: javascript
# Normalized: js
# Block index: 20

[label routes/auth.js]
import express from 'express';
import passport from 'passport';
import User from '../models/user.js';

const router = express.Router();

export default router;