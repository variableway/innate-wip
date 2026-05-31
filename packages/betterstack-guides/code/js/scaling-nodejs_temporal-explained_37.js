# Source: https://betterstack.com/community/guides/scaling-nodejs/temporal-explained/
# Original language: javascript
# Normalized: js
# Block index: 37

import { Temporal } from "@js-temporal/polyfill";

console.log(Temporal.PlainMonthDay.from("02-06").toString());