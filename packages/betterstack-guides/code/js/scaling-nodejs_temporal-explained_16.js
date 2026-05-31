# Source: https://betterstack.com/community/guides/scaling-nodejs/temporal-explained/
# Original language: javascript
# Normalized: js
# Block index: 16

[label index.js]
import { Temporal } from "@js-temporal/polyfill";

const instantFromString = Temporal.Instant.from("2025-02-06T11:46:06.959366942Z");
console.log(instantFromString.toString());