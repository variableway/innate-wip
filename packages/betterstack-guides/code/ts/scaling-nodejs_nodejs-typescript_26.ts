# Source: https://betterstack.com/community/guides/scaling-nodejs/nodejs-typescript/
# Original language: typescript
# Normalized: ts
# Block index: 26

[label src/server.ts]
. . .
app.get('/', async (req, res, next) => {
  try {
    [highlight]
    let data: ExchangeRateResult | undefined = appCache.get('exchangeRates');
    [/highlight]

    . . .
  } catch (err) {
    . . .
  }
});
. . .