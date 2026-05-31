# Source: https://betterstack.com/community/guides/scaling-nodejs/express-5-new-features/
# Original language: javascript
# Normalized: js
# Block index: 5

// Express 4 example
app.get('/user/:id?', (req, res) => res.send(req.params.id || 'No ID'));

// Express 5 example
app.get('/user{/:id}', (req, res) => res.send(req.params.id || 'No ID'));