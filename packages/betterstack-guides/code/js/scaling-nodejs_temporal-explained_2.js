# Source: https://betterstack.com/community/guides/scaling-nodejs/temporal-explained/
# Original language: javascript
# Normalized: js
# Block index: 2

new Date('2025-02-06');    // Works everywhere
new Date('2025/02/06');    // Might fail in Safari
new Date('06-02-2025');    // Different results in different browsers