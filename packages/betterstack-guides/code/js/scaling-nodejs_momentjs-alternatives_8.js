# Source: https://betterstack.com/community/guides/scaling-nodejs/momentjs-alternatives/
# Original language: javascript
# Normalized: js
# Block index: 8

const date = Temporal.PlainDate.from('2025-04-28');

// Format with Intl.DateTimeFormat
const formatter = new Intl.DateTimeFormat('fr', { dateStyle: 'full' });
console.log(formatter.format(date)); // lundi 28 avril 2025

// Working with different calendar systems
const hebrewDate = Temporal.PlainDate.from({
  year: 5785,
  month: 7,
  day: 15,
  calendar: 'hebrew'
});
console.log(hebrewDate.toString()); // 5785-07-15[u-ca=hebrew]

// Converting between calendar systems
const islamicDate = hebrewDate.withCalendar('islamic');
console.log(islamicDate.toString()); // 1447-01-12[u-ca=islamic]