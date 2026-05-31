# Source: https://betterstack.com/community/guides/scaling-nodejs/valibot-validation/
# Original language: javascript
# Normalized: js
# Block index: 1

[label index.js]
import * as v from 'valibot';

// Create a simple schema and validate some data
const personSchema = v.object({ name: v.string(), age: v.number() });

console.log(v.parse(personSchema, { name: "Jane", age: 30 }));