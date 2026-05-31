# Source: https://betterstack.com/community/guides/scaling-nodejs/momentjs-alternatives/
# Original language: javascript
# Normalized: js
# Block index: 6

// Getting the current date and time in the local time zone
const now = Temporal.Now.plainDateTimeISO();
console.log(now.toString()); // e.g., 2025-04-28T16:25:30.123456789

// Working with time zones
const timeZone = Temporal.TimeZone.from('Europe/Paris');
console.log(timeZone.toString()); // Europe/Paris

// Converting a plain datetime to a specific time zone
const zonedDateTime = dateTime.toZonedDateTime(timeZone);
console.log(zonedDateTime.toString()); // 2025-04-28T15:30:00+02:00[Europe/Paris]