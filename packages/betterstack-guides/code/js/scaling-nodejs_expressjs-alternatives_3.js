# Source: https://betterstack.com/community/guides/scaling-nodejs/expressjs-alternatives/
# Original language: javascript
# Normalized: js
# Block index: 3

// Install: npm install koa koa-router
const Koa = require('koa');
const Router = require('koa-router');

const app = new Koa();
const router = new Router();

// Middleware example
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// Route definition
router.get('/', async (ctx) => {
  ctx.body = { message: 'Hello World' };
});

router.post('/users', async (ctx) => {
  // Access request body (requires koa-bodyparser middleware)
  const userData = ctx.request.body;
  // Process user data...
  ctx.status = 201;
  ctx.body = { success: true, id: 'new-user-id' };
});

// Use the router
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});