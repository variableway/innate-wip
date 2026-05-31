# Source: https://betterstack.com/community/guides/scaling-nodejs/temporal-explained/
# Original language: javascript
# Normalized: js
# Block index: 8

[label index.js]
import { Temporal } from "@js-temporal/polyfill";

const now = Temporal.Now.instant();
console.log(Object.getOwnPropertyNames(Object.getPrototypeOf(now)));