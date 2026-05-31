# Source: https://betterstack.com/community/guides/scaling-nodejs/momentjs-alternatives/
# Original language: javascript
# Normalized: js
# Block index: 22

import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar';
import 'dayjs/locale/es';

dayjs.extend(calendar);
dayjs.locale('es');

const today = dayjs();

console.log(today.calendar(null, {
  sameDay: '[Hoy a las] HH:mm',
  nextDay: '[Mañana a las] HH:mm',
  nextWeek: 'dddd [a las] HH:mm',
  lastDay: '[Ayer a las] HH:mm',
  lastWeek: '[El] dddd [pasado a las] HH:mm',
  sameElse: 'DD/MM/YYYY'
})); // Output depends on current time