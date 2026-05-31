# Source: https://betterstack.com/community/guides/scaling-nodejs/temporal-explained/
# Original language: javascript
# Normalized: js
# Block index: 24

[label index.js]

const zonedDateTime = Temporal.ZonedDateTime.from({
  ...
  month: 2,
[highlight]
  day: 30,
[/highlight]
  ...
});