# Source: https://betterstack.com/community/guides/scaling-nodejs/passport-js-with-express/
# Original language: javascript
# Normalized: js
# Block index: 6

[label app.js]
import express from 'express';
[highlight]
import morgan from 'morgan';
import cors from 'cors';
[/highlight]

const app = express();

[highlight]
// Essential middleware
app.use(morgan('dev'));
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
[/highlight]

app.get('/', (req, res) => {
  res.json({ message: 'Hello World - Authentication Server' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});