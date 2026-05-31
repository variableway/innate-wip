# Source: https://betterstack.com/community/guides/scaling-nodejs/express-5-new-features/
# Original language: javascript
# Normalized: js
# Block index: 2

// Express 4 example
app.get('/:id(\\d+)', (req, res) => res.send(`ID: ${req.params.id}`));