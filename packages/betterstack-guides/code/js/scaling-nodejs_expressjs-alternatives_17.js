# Source: https://betterstack.com/community/guides/scaling-nodejs/expressjs-alternatives/
# Original language: javascript
# Normalized: js
# Block index: 17

const polka = require('polka');
const { json } = require('body-parser');

const app = polka();
app.use(json());

// Helper function for JSON responses
const send = (res, status, data) => {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
};

app.get('/api/users', (req, res) => {
  const users = [
    { id: 1, name: 'User One' },
    { id: 2, name: 'User Two' }
  ];

  send(res, 200, users);
});

app.post('/api/users', (req, res) => {
  // req.body available because of body-parser
  const newUser = {
    id: 3,
    ...req.body
  };

  send(res, 201, newUser);
});

app.listen(3000);