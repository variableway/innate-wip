# Source: https://betterstack.com/community/guides/scaling-nodejs/temporal-explained/
# Original language: javascript
# Normalized: js
# Block index: 38

[label index.js]
import { Temporal } from "@js-temporal/polyfill";

const duration = Temporal.Duration.from({ days: 5, hours: 3, minutes: 30 });
console.log(duration.toString());