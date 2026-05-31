# Source: https://betterstack.com/community/guides/scaling-nodejs/momentjs-alternatives/
# Original language: javascript
# Normalized: js
# Block index: 0

// Create formatters with different locales
const usDateFormatter = new Intl.DateTimeFormat('en-US');
const germanDateFormatter = new Intl.DateTimeFormat('de-DE');
const japaneseFormatter = new Intl.DateTimeFormat('ja-JP');

// Format the same date for different locales
const date = new Date(2025, 3, 28);
console.log(usDateFormatter.format(date));      // 4/28/2025
console.log(germanDateFormatter.format(date));  // 28.4.2025
console.log(japaneseFormatter.format(date));    // 2025/4/28