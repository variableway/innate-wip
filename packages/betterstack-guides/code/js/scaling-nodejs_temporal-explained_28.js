# Source: https://betterstack.com/community/guides/scaling-nodejs/temporal-explained/
# Original language: javascript
# Normalized: js
# Block index: 28

[label index.js]
import { Temporal } from "@js-temporal/polyfill";

const ambiguousTime = Temporal.ZonedDateTime.from({
  timeZone: "America/New_York",
  year: 2025,
  month: 11,
  day: 2,  // The day when DST ends in the US
  hour: 1, // This hour happens twice (1 AM before and after the shift)
  minute: 30,
});
console.log(ambiguousTime.toString());