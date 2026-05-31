# Source: https://betterstack.com/community/guides/scaling-nodejs/passport-js-with-express/
# Original language: javascript
# Normalized: js
# Block index: 23

[label app.js]
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import sequelize from './config/database.js';
import User from './models/user.js';
import './config/passport.js';
[highlight]
import authRoutes from './routes/auth.js';
[/highlight]

const app = express();

...
// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

[highlight]
// Routes
app.use('/auth', authRoutes);
[/highlight]

// Database initialization
async function initDatabase() {
  try {
    await sequelize.sync();
    console.log('Database synchronized');
  } catch (error) {
    console.error('Database error:', error);
  }
}
...