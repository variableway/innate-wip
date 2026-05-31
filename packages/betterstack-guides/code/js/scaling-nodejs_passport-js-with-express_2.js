# Source: https://betterstack.com/community/guides/scaling-nodejs/passport-js-with-express/
# Original language: javascript
# Normalized: js
# Block index: 2

[label app.js]
import express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.json({ message: 'Hello World - Authentication Server' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});