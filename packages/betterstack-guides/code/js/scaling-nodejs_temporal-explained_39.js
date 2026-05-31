# Source: https://betterstack.com/community/guides/scaling-nodejs/temporal-explained/
# Original language: javascript
# Normalized: js
# Block index: 39

[label index.js]
import { Temporal } from "@js-temporal/polyfill";

const dateTime = Temporal.PlainDateTime.from("2025-02-06T14:30:00");
const newDateTime = dateTime.add(duration);
console.log('After adding:', newDateTime.toString());

const earlierDateTime = dateTime.subtract(duration);
console.log('After subtracting:', earlierDateTime.toString());