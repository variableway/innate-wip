# Source: https://betterstack.com/community/guides/scaling-nodejs/temporal-explained/
# Original language: javascript
# Normalized: js
# Block index: 26

[label index.js]

const zonedDateTime = Temporal.ZonedDateTime.from({
  ...
  month: 2,
[highlight]
  day: 30, // Invalid day for February
[/highlight]
  ...
}, { overflow: "reject" });

console.log(zonedDateTime.toString());