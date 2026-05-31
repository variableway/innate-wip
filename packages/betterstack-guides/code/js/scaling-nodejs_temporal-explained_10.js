# Source: https://betterstack.com/community/guides/scaling-nodejs/temporal-explained/
# Original language: javascript
# Normalized: js
# Block index: 10

[label index.js]
import { Temporal } from "@js-temporal/polyfill";

const now = Temporal.Now.instant();
console.log('Epoch Seconds:', now.epochSeconds);
console.log('Epoch Milliseconds:', now.epochMilliseconds);
console.log('Epoch Microseconds:', now.epochMicroseconds);
console.log('Epoch Nanoseconds:', now.epochNanoseconds);