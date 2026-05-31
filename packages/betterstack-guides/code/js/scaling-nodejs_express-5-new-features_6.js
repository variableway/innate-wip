# Source: https://betterstack.com/community/guides/scaling-nodejs/express-5-new-features/
# Original language: javascript
# Normalized: js
# Block index: 6

// Express 4 example
app.get('/user(s?)', (req, res) => res.send(req.params[0])); // 's'