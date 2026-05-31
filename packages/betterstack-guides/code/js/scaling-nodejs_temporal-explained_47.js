# Source: https://betterstack.com/community/guides/scaling-nodejs/temporal-explained/
# Original language: javascript
# Normalized: js
# Block index: 47

[label index.js]
import { Temporal } from "@js-temporal/polyfill";

const instant = Temporal.Instant.from("2025-02-06T14:23:45Z");

// Different rounding modes
console.log('Round down:', instant.round({ 
    smallestUnit: 'hour', 
    roundingMode: 'floor' 
}).toString());

console.log('Round up:', instant.round({ 
    smallestUnit: 'hour', 
    roundingMode: 'ceil' 
}).toString());