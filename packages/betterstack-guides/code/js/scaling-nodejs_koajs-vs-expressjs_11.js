# Source: https://betterstack.com/community/guides/scaling-nodejs/koajs-vs-expressjs/
# Original language: javascript
# Normalized: js
# Block index: 11

app.use(authenticate);
app.use(authorize);
app.use(validateInput);
app.use(logRequest);

router.get('/users', async (ctx) => {
  const users = await User.find({});
  await Promise.all(users.map(user => user.sanitize()));
  ctx.body = users;
});