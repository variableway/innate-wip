# Source: https://betterstack.com/community/guides/scaling-nodejs/momentjs-alternatives/
# Original language: javascript
# Normalized: js
# Block index: 1

const date = new Date(2025, 3, 28, 15, 30, 45);

// Using date and time style presets
const formatter = new Intl.DateTimeFormat('en-GB', {
  dateStyle: 'full',
  timeStyle: 'long'
});
console.log(formatter.format(date)); // Monday, 28 April 2025 at 15:30:45 GMT+1

// Customizing individual components
const customFormatter = new Intl.DateTimeFormat('fr-FR', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false
});
console.log(customFormatter.format(date)); // lundi 28 avril 2025, 15:30