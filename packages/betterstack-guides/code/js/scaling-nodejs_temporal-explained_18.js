# Source: https://betterstack.com/community/guides/scaling-nodejs/temporal-explained/
# Original language: javascript
# Normalized: js
# Block index: 18

[label index.js]
import { Temporal } from "@js-temporal/polyfill";

try {
    const instant = Temporal.Instant.from("2025-02-06T11:46:06");
} catch (error) {
    console.log('Error:', error.message);
}