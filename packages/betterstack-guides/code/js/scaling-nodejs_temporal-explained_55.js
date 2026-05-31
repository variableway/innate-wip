# Source: https://betterstack.com/community/guides/scaling-nodejs/temporal-explained/
# Original language: javascript
# Normalized: js
# Block index: 55

[label index.js]
import { Temporal } from "@js-temporal/polyfill";

const nyDateTime = Temporal.ZonedDateTime.from({
    timeZone: 'America/New_York',
    year: 2025, month: 2, day: 6,
    hour: 9, minute: 30
});

const londonDateTime = Temporal.ZonedDateTime.from({
    timeZone: 'Europe/London',
    year: 2025, month: 2, day: 6,
    hour: 14, minute: 30
});

// These times might look different but represent the same instant
console.log('Same instant:', nyDateTime.equals(londonDateTime));