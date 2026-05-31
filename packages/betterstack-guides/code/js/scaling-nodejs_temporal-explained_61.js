# Source: https://betterstack.com/community/guides/scaling-nodejs/temporal-explained/
# Original language: javascript
# Normalized: js
# Block index: 61

[label index.js]
import { Temporal } from "@js-temporal/polyfill";

const date = Temporal.Now.plainDateTime('gregory');

const custom = `${date.day}/${date.month}/${date.year} at ${date.hour}:${String(date.minute).padStart(2, '0')}`;
console.log('Custom format:', custom);

// Additional useful properties
console.log('Day of week:', date.dayOfWeek);    // 1-7 (Monday is 1)
console.log('Day of year:', date.dayOfYear);     // 1-365/366