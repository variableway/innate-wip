# Source: https://betterstack.com/community/guides/scaling-nodejs/temporal-explained/
# Original language: javascript
# Normalized: js
# Block index: 53

[label index.js]
import { Temporal } from "@js-temporal/polyfill";

const instant1 = Temporal.Instant.from("2025-02-06T14:30:00Z");
const instant2 = Temporal.Instant.from("2025-02-06T14:30:00Z");

console.log('Exactly same time:', instant1.equals(instant2));
console.log('Same or before:', instant1.lessOrEqual(instant2));
console.log('Same or after:', instant1.greaterOrEqual(instant2));