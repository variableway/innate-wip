# Source: https://betterstack.com/community/guides/scaling-nodejs/momentjs-alternatives/
# Original language: javascript
# Normalized: js
# Block index: 10

// Create dates in multiple ways
const now = DateTime.now();
const fromObject = DateTime.fromObject({ year: 2025, month: 4, day: 28 });
const fromISO = DateTime.fromISO('2025-04-28T15:30:45');

// Format dates
console.log(now.toLocaleString(DateTime.DATETIME_FULL)); // April 28, 2025, 4:30 PM EDT
console.log(fromObject.toFormat('yyyy LLL dd')); // 2025 Apr 28

// Using different locales
console.log(fromISO.setLocale('fr').toFormat('MMMM dd, yyyy')); // avril 28, 2025
console.log(fromISO.setLocale('de').toLocaleString(DateTime.DATE_FULL)); // Montag, 28. April 2025