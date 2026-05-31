# Source: https://betterstack.com/community/guides/scaling-nodejs/koajs-vs-expressjs/
# Original language: javascript
# Normalized: js
# Block index: 0

const express = require('express');
const app = express();

app.use(express.json());
app.get('/api/users', (req, res) => {
  res.json({ message: 'Hello World' });
});

app.listen(3000);