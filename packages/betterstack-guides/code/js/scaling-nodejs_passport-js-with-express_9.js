# Source: https://betterstack.com/community/guides/scaling-nodejs/passport-js-with-express/
# Original language: javascript
# Normalized: js
# Block index: 9

[label app.js]
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
[highlight]
import session from 'express-session';
import passport from 'passport';
[/highlight]

const app = express();

// Essential middleware
app.use(morgan('dev'));
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

[highlight]
// Session configuration
app.use(session({
  secret: 'your-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true in production with HTTPS
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());
[/highlight]

app.get('/', (req, res) => {
  res.json({ 
    message: 'Hello World - Authentication Server',
    [highlight]
    authenticated: req.isAuthenticated ? req.isAuthenticated() : false
    [/highlight]
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});