# Source: https://betterstack.com/community/guides/scaling-nodejs/valibot-validation/
# Original language: javascript
# Normalized: js
# Block index: 5

[label index.js]
import * as v from 'valibot';

[highlight]
// Create a person schema with validation rules
const personSchema = v.object({
  name: v.pipe(
    v.string(),
    v.minLength(3, 'Name must be at least 3 characters')
  ),
  age: v.number()
});

// Try with valid data
console.log(v.parse(personSchema, { name: "Jane", age: 30 }));

// Try with invalid data
try {
  console.log(v.parse(personSchema, { name: "Jo", age: 30 }));
} catch (error) {
  console.log('Validation error:', error.issues[0].message);
}
[/highlight]