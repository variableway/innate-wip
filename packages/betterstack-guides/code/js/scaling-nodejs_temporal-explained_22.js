# Source: https://betterstack.com/community/guides/scaling-nodejs/temporal-explained/
# Original language: javascript
# Normalized: js
# Block index: 22

[label index.js]
import { Temporal } from "@js-temporal/polyfill";

const zonedDateTime = Temporal.ZonedDateTime.from({
  timeZone: "Europe/London",
  year: 2025,
  month: 2,
  day: 6,
  hour: 14,
  minute: 30,
  second: 0,
});

console.log(zonedDateTime.toString());