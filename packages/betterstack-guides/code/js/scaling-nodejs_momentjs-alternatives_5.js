# Source: https://betterstack.com/community/guides/scaling-nodejs/momentjs-alternatives/
# Original language: javascript
# Normalized: js
# Block index: 5

// Creating a date (year, month, day)
const date = Temporal.PlainDate.from({ year: 2025, month: 4, day: 28 });
console.log(date.toString()); // 2025-04-28

// Creating a time
const time = Temporal.PlainTime.from({ hour: 15, minute: 30 });
console.log(time.toString()); // 15:30:00

// Combining date and time
const dateTime = date.toPlainDateTime(time);
console.log(dateTime.toString()); // 2025-04-28T15:30:00