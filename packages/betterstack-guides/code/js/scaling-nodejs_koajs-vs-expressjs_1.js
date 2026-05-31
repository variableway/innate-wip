# Source: https://betterstack.com/community/guides/scaling-nodejs/koajs-vs-expressjs/
# Original language: javascript
# Normalized: js
# Block index: 1

const Koa = require('koa');
const Router = require('@koa/router');
const bodyParser = require('koa-bodyparser');

const app = new Koa();
const router = new Router();

app.use(bodyParser());
router.get('/api/users', (ctx) => {
  ctx.body = { message: 'Hello World' };
});

app.use(router.routes());
app.listen(3000);