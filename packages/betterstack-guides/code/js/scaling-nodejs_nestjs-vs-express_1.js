# Source: https://betterstack.com/community/guides/scaling-nodejs/nestjs-vs-express/
# Original language: javascript
# Normalized: js
# Block index: 1

const express = require('express');
const app = express();

app.use(express.json());

app.get('/api/users', (req, res) => {
  const users = [{ id: 1, name: 'John', email: 'john@example.com' }];
  res.json(users);
});

app.post('/api/users', (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email required' });
  }
  res.status(201).json({ id: Date.now(), name, email });
});

app.listen(3000);