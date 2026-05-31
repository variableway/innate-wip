# Source: https://betterstack.com/community/guides/scaling-nodejs/momentjs-alternatives/
# Original language: javascript
# Normalized: js
# Block index: 16

import { format, formatDistance, formatRelative } from 'date-fns';
import { es, de, fr } from 'date-fns/locale';

const date = new Date(2025, 3, 28);

// Formatting with different locales
console.log(format(date, 'MMMM dd, yyyy', { locale: es })); // abril 28, 2025
console.log(format(date, 'MMMM dd, yyyy', { locale: de })); // April 28, 2025
console.log(format(date, 'MMMM dd, yyyy', { locale: fr })); // avril 28, 2025

// Distance formatting
const futureDate = new Date(2025, 9, 15); // October 15, 2025
console.log(formatDistance(futureDate, date, { locale: es })); // aproximadamente 6 meses
console.log(formatDistance(futureDate, date, { addSuffix: true, locale: fr })); // dans environ 6 mois

// Relative formatting
console.log(formatRelative(date, new Date(), { locale: de })); // 28.04.2025