# Source: https://betterstack.com/community/guides/scaling-nodejs/momentjs-alternatives/
# Original language: javascript
# Normalized: js
# Block index: 20

const date = dayjs('2025-04-28');

// Adding and subtracting time
const nextWeek = date.add(1, 'week');
console.log(nextWeek.format('YYYY-MM-DD')); // 2025-05-05

const lastMonth = date.subtract(1, 'month');
console.log(lastMonth.format('YYYY-MM-DD')); // 2025-03-28

// Start/end of time periods
const startOfMonth = date.startOf('month');
console.log(startOfMonth.format('YYYY-MM-DD')); // 2025-04-01

const endOfYear = date.endOf('year');
console.log(endOfYear.format('YYYY-MM-DD')); // 2025-12-31