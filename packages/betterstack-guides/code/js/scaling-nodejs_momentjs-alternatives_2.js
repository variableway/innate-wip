# Source: https://betterstack.com/community/guides/scaling-nodejs/momentjs-alternatives/
# Original language: javascript
# Normalized: js
# Block index: 2

const rtf = new Intl.RelativeTimeFormat('en', { style: 'long' });

// Format relative times
console.log(rtf.format(-1, 'day'));    // 1 day ago
console.log(rtf.format(2, 'month'));   // in 2 months
console.log(rtf.format(-5, 'year'));   // 5 years ago

// Using 'auto' numeric option for more natural language
const naturalRtf = new Intl.RelativeTimeFormat('en', {
  numeric: 'auto'
});
console.log(naturalRtf.format(-1, 'day'));    // yesterday
console.log(naturalRtf.format(0, 'day'));     // today
console.log(naturalRtf.format(1, 'day'));     // tomorrow