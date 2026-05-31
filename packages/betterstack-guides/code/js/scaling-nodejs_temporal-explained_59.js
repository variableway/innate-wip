# Source: https://betterstack.com/community/guides/scaling-nodejs/temporal-explained/
# Original language: javascript
# Normalized: js
# Block index: 59

[label index.js]
import { Temporal } from "@js-temporal/polyfill";

const date = Temporal.Now.plainDateTime('gregory');

// Different locale formats
console.log('US format:', date.toLocaleString('en-US', {
    weekday: 'long',    // Full weekday name
    year: 'numeric',    // Four-digit year
    month: 'long',      // Full month name
    day: 'numeric',     // Day of the month
    hour: 'numeric',    // Hour (12-hour clock in US)
    minute: 'numeric'   // Minutes
}));

console.log('German format:', date.toLocaleString('de-DE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
}));