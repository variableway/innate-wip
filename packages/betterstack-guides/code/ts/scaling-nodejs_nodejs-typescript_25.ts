# Source: https://betterstack.com/community/guides/scaling-nodejs/nodejs-typescript/
# Original language: typescript
# Normalized: ts
# Block index: 25

[label src/server.ts]
. . .
[highlight]
async function getExchangeRates(): Promise<Rates> {
[/highlight]
  // ... function body ...
}

[highlight]
async function refreshExchangeRates(): Promise<ExchangeRateResult> {
[/highlight]
  // ... function body ...
}
. . .