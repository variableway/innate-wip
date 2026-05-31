# Source: https://betterstack.com/community/guides/scaling-nodejs/valibot-validation/
# Original language: javascript
# Normalized: js
# Block index: 3

[label index.js]
import * as v from 'valibot';

const personSchema = v.object({ name: v.string(), age: v.number() });

// Try validating invalid data
[highlight]
try {
  console.log(v.parse(personSchema, { name: "Jane", age: "thirty" }));
} catch (error) {
  console.error('Validation error:', error);
}
[/highlight]