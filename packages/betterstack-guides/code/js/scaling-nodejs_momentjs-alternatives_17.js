# Source: https://betterstack.com/community/guides/scaling-nodejs/momentjs-alternatives/
# Original language: javascript
# Normalized: js
# Block index: 17

import {
  differenceInDays,
  eachDayOfInterval,
  isSameMonth,
  getWeeksInMonth,
  parse
} from 'date-fns';

const start = new Date(2025, 3, 15);  // April 15, 2025
const end = new Date(2025, 4, 15);    // May 15, 2025

// Calculate difference between dates
const daysDiff = differenceInDays(end, start);
console.log(`Difference: ${daysDiff} days`); // Difference: 30 days

// Generate an array of dates in an interval
const daysInInterval = eachDayOfInterval({ start, end });
console.log(`Days in interval: ${daysInInterval.length}`); // Days in interval: 31

// Check if dates are in the same month
console.log(isSameMonth(start, end)); // false

// Get number of weeks in a month
console.log(getWeeksInMonth(start)); // 5

// Parse a string into a Date
const parsedDate = parse('April 28, 2025', 'MMMM dd, yyyy', new Date());
console.log(parsedDate); // Mon Apr 28 2025...