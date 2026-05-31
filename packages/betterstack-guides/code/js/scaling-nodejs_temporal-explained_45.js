# Source: https://betterstack.com/community/guides/scaling-nodejs/temporal-explained/
# Original language: javascript
# Normalized: js
# Block index: 45

[label index.js]
import { Temporal } from "@js-temporal/polyfill";

const instant = Temporal.Instant.from("2025-02-06T14:23:45.123456789Z");

// Round to different units
console.log('To minutes:', instant.round({ smallestUnit: 'minute' }).toString());
console.log('To hours:', instant.round({ smallestUnit: 'hour' }).toString());
console.log('To days:', instant.round({ smallestUnit: 'day' }).toString());