# Source: https://betterstack.com/community/guides/scaling-nodejs/koajs-vs-expressjs/
# Original language: javascript
# Normalized: js
# Block index: 10

app.use(authenticate);
app.use(authorize);
app.use(validateInput);
app.use(logRequest);

app.get('/users', (req, res, next) => {
  // Multiple callback levels make debugging harder
  User.find({}, (err, users) => {
    if (err) return next(err);
    users.forEach(user => {
      user.sanitize((err) => {
        if (err) return next(err);
        // Nested callback complexity grows
      });
    });
  });
});