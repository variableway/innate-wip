# Source: https://betterstack.com/community/guides/scaling-nodejs/momentjs-alternatives/
# Original language: javascript
# Normalized: js
# Block index: 7

const date = Temporal.PlainDate.from('2025-04-28');

// Adding time units
const futureDate = date.add({ days: 5, months: 1 });
console.log(futureDate.toString()); // 2025-06-02

// Subtracting time units
const pastDate = date.subtract({ weeks: 2 });
console.log(pastDate.toString()); // 2025-04-14

// Creating and using durations
const duration = Temporal.Duration.from({ days: 10, hours: 5 });
const newDate = date.add(duration);
console.log(newDate.toString()); // 2025-05-08T05:00:00

// Finding the difference between dates
const start = Temporal.PlainDate.from('2025-01-01');
const end = Temporal.PlainDate.from('2025-04-28');
const diff = start.until(end);
console.log(diff.toString()); // P3M27D (ISO 8601 duration format)
console.log(`${diff.months} months and ${diff.days} days`); // 3 months and 27 days