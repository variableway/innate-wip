# Source: https://betterstack.com/community/guides/scaling-nodejs/temporal-explained/
# Original language: javascript
# Normalized: js
# Block index: 3

const start = new Date();
performHighSpeedOperation();
const end = new Date();
console.log(`Operation took ${end - start} milliseconds`); // Not precise enough