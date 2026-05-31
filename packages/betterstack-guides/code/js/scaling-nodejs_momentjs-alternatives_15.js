# Source: https://betterstack.com/community/guides/scaling-nodejs/momentjs-alternatives/
# Original language: javascript
# Normalized: js
# Block index: 15

import { format, addDays, subMonths, startOfWeek, isToday } from 'date-fns';

const date = new Date(2025, 3, 28); // April 28, 2025

// Formatting dates
console.log(format(date, 'MMMM dd, yyyy')); // April 28, 2025
console.log(format(date, 'yyyy-MM-dd')); // 2025-04-28

// Manipulating dates
const nextWeek = addDays(date, 7);
console.log(format(nextWeek, 'MM/dd/yyyy')); // 05/05/2025

const threeMonthsAgo = subMonths(date, 3);
console.log(format(threeMonthsAgo, 'MM/dd/yyyy')); // 01/28/2025

// Getting start of a time period
const weekStart = startOfWeek(date);
console.log(format(weekStart, 'MM/dd/yyyy')); // 04/27/2025 (Sunday)

// Date checking
console.log(isToday(date)); // false
console.log(isToday(new Date())); // true