# Source: https://betterstack.com/community/guides/scaling-nodejs/momentjs-alternatives/
# Original language: javascript
# Normalized: js
# Block index: 11

const date = DateTime.fromISO('2025-04-28');

// These operations return new DateTime objects
const nextWeek = date.plus({ days: 7 });
const lastMonth = date.minus({ months: 1 });
const startOfMonth = date.startOf('month');
const endOfYear = date.endOf('year');

console.log(date.toISODate());         // 2025-04-28 (original unchanged)
console.log(nextWeek.toISODate());     // 2025-05-05
console.log(lastMonth.toISODate());    // 2025-03-28
console.log(startOfMonth.toISODate()); // 2025-04-01
console.log(endOfYear.toISODate());    // 2025-12-31T23:59:59.999