# Source: https://betterstack.com/community/guides/scaling-nodejs/momentjs-alternatives/
# Original language: javascript
# Normalized: js
# Block index: 21

import dayjs from 'dayjs';
// Import plugins
import relativeTime from 'dayjs/plugin/relativeTime';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import calendar from 'dayjs/plugin/calendar';
// Import locale
import 'dayjs/locale/fr';

// Load plugins
dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);
dayjs.extend(calendar);

const date = dayjs('2025-04-28');

// Using localized formats
dayjs.locale('fr'); // Set globally
console.log(date.format('L')); // 28/04/2025 (French locale)

// Or set per instance
console.log(date.locale('en').format('L')); // 04/28/2025 (English locale)

// Relative time
console.log(dayjs().to(date)); // in a year (assuming current date is 2024)
console.log(date.from(dayjs())); // a year ago

// Calendar time
console.log(dayjs().add(1, 'day').calendar()); // Tomorrow at 2:30 PM