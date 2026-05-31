# Source: https://betterstack.com/community/guides/scaling-nodejs/rate-limiting-express/
# Original language: javascript
# Normalized: js
# Block index: 2

[label server.js]
import express from 'express';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ 
    message: 'Rate Limiting Demo API', 
    timestamp: new Date().toISOString(),
    environment: 'development'
  });
});

app.get('/api/users', (req, res) => {
  res.json({ 
    users: [
      { id: 1, name: 'John Doe', email: 'john@example.com' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
    ],
    total: 2,
    requestId: Math.random().toString(36).substr(2, 9)
  });
});

app.get('/api/products', (req, res) => {
  res.json({
    products: [
      { id: 1, name: 'Laptop', price: 999 },
      { id: 2, name: 'Phone', price: 599 }
    ],
    total: 2
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});