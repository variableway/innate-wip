# Source: https://betterstack.com/community/guides/scaling-nodejs/temporal-explained/
# Original language: javascript
# Normalized: js
# Block index: 43

[label index.js]
import { Temporal } from "@js-temporal/polyfill";

const thirtyDays = Temporal.Duration.from({ days: 30 });
console.log('Thirty days in seconds:', thirtyDays.total({ unit: "seconds" }));

console.log('Negated duration:', thirtyDays.negated().toString());