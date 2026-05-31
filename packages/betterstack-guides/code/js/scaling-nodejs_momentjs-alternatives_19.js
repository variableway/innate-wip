# Source: https://betterstack.com/community/guides/scaling-nodejs/momentjs-alternatives/
# Original language: javascript
# Normalized: js
# Block index: 19

// Create dates
const now = dayjs();
const specificDate = dayjs('2025-04-28');
const fromValues = dayjs('2025-04-28T15:30:00');

// Format dates
console.log(now.format('YYYY-MM-DD')); // 2025-04-28 (current date)
console.log(specificDate.format('MMMM D, YYYY')); // April 28, 2025
console.log(fromValues.format('HH:mm, MMM D')); // 15:30, Apr 28