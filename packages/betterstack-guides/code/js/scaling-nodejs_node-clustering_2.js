# Source: https://betterstack.com/community/guides/scaling-nodejs/node-clustering/
# Original language: javascript
# Normalized: js
# Block index: 2

[label index.js]
import express from 'express';
import { readFile } from 'node:fs/promises';

const app = express();
const PORT = 3000;

app.get('/read-content', async (req, res) => {
  try {
    const data = await readFile('content.txt', 'utf8');
    res.status(200).send(data);
  } catch (error) {
    console.error('Error reading file:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`App (PID: ${process.pid}) is listening on port ${PORT}`);
});