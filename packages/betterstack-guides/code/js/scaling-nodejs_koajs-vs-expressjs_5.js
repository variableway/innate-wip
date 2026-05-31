# Source: https://betterstack.com/community/guides/scaling-nodejs/koajs-vs-expressjs/
# Original language: javascript
# Normalized: js
# Block index: 5

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    ctx.status = error.status || 500;
    ctx.body = { error: error.message };
  }
});

router.get('/users/:id', async (ctx) => {
  const user = await User.findById(ctx.params.id);
  if (!user) ctx.throw(404, 'User not found');
  ctx.body = user;
});