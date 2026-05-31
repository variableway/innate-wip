# Source: https://betterstack.com/community/guides/scaling-nodejs/momentjs-alternatives/
# Original language: javascript
# Normalized: js
# Block index: 12

const now = DateTime.now();
const tomorrow = now.plus({ days: 1 });
const lastYear = now.minus({ years: 1 });

// Relative time from now
console.log(tomorrow.toRelative());  // in 1 day
console.log(lastYear.toRelative());  // 1 year ago

// With different locales
console.log(tomorrow.setLocale('es').toRelative());  // dentro de 1 día
console.log(lastYear.setLocale('fr').toRelative());  // il y a 1 an

// Calendar-aware relative time
console.log(tomorrow.toRelativeCalendar());  // tomorrow
console.log(lastYear.toRelativeCalendar());  // Apr 28, 2024