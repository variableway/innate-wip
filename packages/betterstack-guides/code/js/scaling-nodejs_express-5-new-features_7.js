# Source: https://betterstack.com/community/guides/scaling-nodejs/express-5-new-features/
# Original language: javascript
# Normalized: js
# Block index: 7

// Express 5 example
app.get('/user:plural?', (req, res) => res.send(req.params.plural));