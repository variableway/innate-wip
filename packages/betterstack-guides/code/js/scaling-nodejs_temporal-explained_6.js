# Source: https://betterstack.com/community/guides/scaling-nodejs/temporal-explained/
# Original language: javascript
# Normalized: js
# Block index: 6

[label index.js]
import { Temporal } from "@js-temporal/polyfill";

const now = Temporal.Now;
console.log(now);