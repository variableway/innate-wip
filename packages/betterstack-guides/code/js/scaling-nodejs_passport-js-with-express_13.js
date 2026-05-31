# Source: https://betterstack.com/community/guides/scaling-nodejs/passport-js-with-express/
# Original language: javascript
# Normalized: js
# Block index: 13

[label app.js]
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
[highlight]
import sequelize from './config/database.js';
import User from './models/user.js';
[/highlight]

const app = express();

...
// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

[highlight]
// Database initialization
async function initDatabase() {
  try {
    await sequelize.sync();
    console.log('Database synchronized');
  } catch (error) {
    console.error('Database error:', error);
  }
}
[/highlight]

app.get('/', (req, res) => {
  res.json({ 
    message: 'Hello World - Authentication Server',
    authenticated: req.isAuthenticated ? req.isAuthenticated() : false
  });
});

const PORT = process.env.PORT || 3000;
[highlight]
app.listen(PORT, async () => {
[/highlight]
  console.log(`Server running on http://localhost:${PORT}`);
  [highlight]
  await initDatabase();
  [/highlight]
});