# Source: https://betterstack.com/community/guides/scaling-nodejs/temporal-explained/
# Original language: javascript
# Normalized: js
# Block index: 57

[label index.js]
import { Temporal } from "@js-temporal/polyfill";

const zonedDateTime = Temporal.ZonedDateTime.from({
    timeZone: 'America/New_York',
    year: 2025, month: 2, day: 6,
    hour: 14, minute: 30, second: 45
});

// Different string representations
console.log('Default:', zonedDateTime.toString());
console.log('Date only:', zonedDateTime.toPlainDate().toString());
console.log('Time only:', zonedDateTime.toPlainTime().toString());