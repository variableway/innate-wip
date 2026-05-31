# Source: https://betterstack.com/community/guides/scaling-nodejs/koa-vs-hapi/
# Original language: javascript
# Normalized: js
# Block index: 0

const Koa = require('koa');
const app = new Koa();

app.use(async (ctx, next) => {
  await next();
  ctx.set('X-Response-Time', `${ctx.responseTime}ms`);
});

app.use(async ctx => {
  ctx.body = { message: 'Hello World' };
});