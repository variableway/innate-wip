# Source: https://betterstack.com/community/guides/scaling-nodejs/yarn-explained/
# Original language: javascript
# Normalized: js
# Block index: 5

[label index.js]
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello from Yarn!');
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});