# Source: https://betterstack.com/community/guides/scaling-nodejs/temporal-explained/
# Original language: javascript
# Normalized: js
# Block index: 32

[label index.js]
import { Temporal } from "@js-temporal/polyfill";

console.log(Temporal.PlainDateTime.from("2025-02-06T14:30:00").toString());