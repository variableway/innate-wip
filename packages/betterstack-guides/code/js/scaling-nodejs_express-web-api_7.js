# Source: https://betterstack.com/community/guides/scaling-nodejs/express-web-api/
# Original language: javascript
# Normalized: js
# Block index: 7

[label app.js]
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
[highlight]
import sequelize from './config/database.js';
[/highlight]

// Create Express application
const app = express();

// Middleware
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

[highlight]
// Initialize database
async function initDb() {
  try {
    // This will create tables based on models (we'll define these soon)
    await sequelize.sync();
    console.log('Database synchronized');
  } catch (error) {
    console.error('Failed to sync database:', error);
  }
}
[/highlight]

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Blog API' });
});

// Start server
const PORT = process.env.PORT || 3000;
[highlight]
app.listen(PORT, async () => {
[/highlight]
  console.log(`Server running on http://localhost:${PORT}`);
  
[highlight]
  // Initialize database after server starts
  await initDb();
[/highlight]
});