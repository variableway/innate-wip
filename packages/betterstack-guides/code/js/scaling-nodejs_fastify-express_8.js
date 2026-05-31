# Source: https://betterstack.com/community/guides/scaling-nodejs/fastify-express/
# Original language: javascript
# Normalized: js
# Block index: 8

[label main.js]
import express from 'express';
import { userPlugin } from './userPlugin.js';

const app = express();

userPlugin(app);

app.get('/hello', (req, res) => {
  res.json({ message: 'Hello from another route!' });
});

app.listen(3000, () => {
  console.log('Express server running at http://localhost:3000');
});