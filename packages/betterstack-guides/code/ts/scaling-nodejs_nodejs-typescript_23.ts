# Source: https://betterstack.com/community/guides/scaling-nodejs/nodejs-typescript/
# Original language: typescript
# Normalized: ts
# Block index: 23

[label src/server.ts]
. . .

app.set('views', path.join(__dirname, '..', 'views'));

[highlight]
type Currency = {
  name: string;
  unit: string;
  value: number;
  type: string;
};

type Rates = {
  rates: {
    [key: string]: Currency;
  };
};

type ExchangeRateResult = {
  timestamp: Date;
  data: Rates;
};
[/highlight]

. . .