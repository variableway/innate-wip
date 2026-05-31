# Source: https://betterstack.com/community/guides/scaling-nodejs/express-web-api/
# Original language: javascript
# Normalized: js
# Block index: 3

[label app.js]
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

// Create Express application
const app = express();

// Middleware
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Blog API' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});