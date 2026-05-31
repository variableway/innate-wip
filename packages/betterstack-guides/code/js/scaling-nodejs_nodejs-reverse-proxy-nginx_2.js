# Source: https://betterstack.com/community/guides/scaling-nodejs/nodejs-reverse-proxy-nginx/
# Original language: javascript
# Normalized: js
# Block index: 2

[label server.js]
const fastify = require("fastify")({
  logger: true,
});
const got = require("got");
const NodeCache = require("node-cache");

const appCache = new NodeCache();

fastify.get("/crypto", async function (_req, res) {
  try {
    let tickerPrice = appCache.get("24hrTickerPrice");

    if (tickerPrice == null) {
      const response = await got("<https://api2.binance.com/api/v3/ticker/24hr>");
      tickerPrice = response.body;

      appCache.set("24hrTickerPrice", tickerPrice, 300);
    }

    res
      .header("Content-Type", "application/json; charset=utf-8")
      .send(tickerPrice);
  } catch (err) {
    fastify.log.error(err);
    res.code(err.response.code).send(err.response.body);
  }
});

fastify.listen(3000, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});