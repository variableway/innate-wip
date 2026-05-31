# Source: https://betterstack.com/community/guides/scaling-nodejs/temporal-explained/
# Original language: javascript
# Normalized: js
# Block index: 51

[label index.js]
import { Temporal } from "@js-temporal/polyfill";

const date1 = Temporal.PlainDateTime.from("2025-02-06T14:30:00");
const date2 = Temporal.PlainDateTime.from("2025-02-06T15:45:00");

// Basic comparisons
console.log('equals:', date1.equals(date2));
console.log('before:', date1.compare(date2) < 0);
console.log('after:', date1.compare(date2) > 0);