# Source: https://betterstack.com/community/guides/scaling-nodejs/temporal-explained/
# Original language: javascript
# Normalized: js
# Block index: 49

[label index.js]
import { Temporal } from "@js-temporal/polyfill";

const duration = Temporal.Duration.from({ 
    hours: 2, 
    minutes: 45, 
    seconds: 30 
});

console.log('Original:', duration.toString());
console.log('Rounded to hours:', duration.round({ smallestUnit: 'hour' }).toString());