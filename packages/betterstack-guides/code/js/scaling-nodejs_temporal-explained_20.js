# Source: https://betterstack.com/community/guides/scaling-nodejs/temporal-explained/
# Original language: javascript
# Normalized: js
# Block index: 20

[label index.js]
import { Temporal } from "@js-temporal/polyfill";

const instantFromSeconds = Temporal.Instant.fromEpochSeconds(1738842325);
console.log(instantFromSeconds.toString()); 

const instantFromMillis = Temporal.Instant.fromEpochMilliseconds(1738842325915);
console.log(instantFromMillis.toString());