# Source: https://betterstack.com/community/guides/scaling-nodejs/koa-vs-hapi/
# Original language: javascript
# Normalized: js
# Block index: 6

// Multiple dependencies required
const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const jwt = require('koa-jwt');
const helmet = require('koa-helmet');
const cors = require('@koa/cors');

const app = new Koa();
app.use(helmet());
app.use(cors());
app.use(bodyParser());
app.use(jwt({ secret: 'key' }));