# Source: https://betterstack.com/community/guides/scaling-nodejs/nodejs-sqlite/
# Original language: javascript
# Normalized: js
# Block index: 8

[label server.js]
import express from 'express';
import booksRouter from './routes/books.router.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use('/api/books', booksRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});