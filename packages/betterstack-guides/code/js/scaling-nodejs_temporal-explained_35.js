# Source: https://betterstack.com/community/guides/scaling-nodejs/temporal-explained/
# Original language: javascript
# Normalized: js
# Block index: 35

[label index.js]
import { Temporal } from "@js-temporal/polyfill";

console.log(Temporal.PlainTime.from("14:30:00").toString());