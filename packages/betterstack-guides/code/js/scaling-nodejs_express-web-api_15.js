# Source: https://betterstack.com/community/guides/scaling-nodejs/express-web-api/
# Original language: javascript
# Normalized: js
# Block index: 15

[label app.js]
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import sequelize from './config/database.js';
[highlight]
import postsRouter from './routes/posts.js';
[/highlight]

// Create Express application
const app = express();

// Middleware
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

[highlight]
// Routes
app.use('/api/posts', postsRouter);
[/highlight]

// Initialize database
async function initDb() {
  // ... existing code
}

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Blog API' });
});

// ... rest of your app.js file