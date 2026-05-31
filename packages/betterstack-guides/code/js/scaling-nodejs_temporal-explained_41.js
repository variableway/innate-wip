# Source: https://betterstack.com/community/guides/scaling-nodejs/temporal-explained/
# Original language: javascript
# Normalized: js
# Block index: 41

[label index.js]
import { Temporal } from "@js-temporal/polyfill";

const start = Temporal.PlainDateTime.from("2025-02-06T14:30:00");
const end = Temporal.PlainDateTime.from("2025-03-08T10:15:00");

const difference = start.until(end);
console.log('Time until:', difference.toString());

const differenceNegative = end.since(start);
console.log('Time since:', differenceNegative.toString());