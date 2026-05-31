# Source: https://betterstack.com/community/guides/scaling-nodejs/temporal-explained/
# Original language: javascript
# Normalized: js
# Block index: 34

[label index.js]
import { Temporal } from "@js-temporal/polyfill";

console.log(Temporal.PlainDate.from("2025-02-06").toString());