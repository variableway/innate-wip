# Source: https://betterstack.com/community/guides/scaling-nodejs/temporal-explained/
# Original language: javascript
# Normalized: js
# Block index: 30

...
const ambiguousTime = Temporal.ZonedDateTime.from(
  {
    timeZone: "America/New_York",
    ...
[highlight]
  },
  { disambiguation: "later" }
[/highlight]
);
console.log(ambiguousTime.toString());