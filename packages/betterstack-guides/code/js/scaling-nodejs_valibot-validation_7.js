# Source: https://betterstack.com/community/guides/scaling-nodejs/valibot-validation/
# Original language: javascript
# Normalized: js
# Block index: 7

[label index.js]
import * as v from 'valibot';

// Create a person schema with more validation rules
const personSchema = v.object({
  name: v.pipe(
    v.string('Name must be a string'),
    v.minLength(3, 'Name must be at least 3 characters'),
[highlight]
    v.maxLength(20, 'Name cannot exceed 20 characters')
[/highlight]
  ),
[highlight]
  email: v.pipe(
    v.string('Email must be a string'),
    v.email('Must be a valid email address')
  ),
  age: v.pipe(
    v.number('Age must be a number'),
    v.minValue(18, 'Must be at least 18 years old')
  )
[/highlight]
});

[highlight]
// Try with valid data
const validPerson = {
  name: 'Jane Doe',
  email: 'jane@example.com',
  age: 25
};

console.log('Valid person:', v.parse(personSchema, validPerson));

// Try with invalid data
try {
  const invalidPerson = {
    name: 'Jo',
    email: 'not-an-email',
    age: 16
  };
  v.parse(personSchema, invalidPerson);
} catch (error) {
  console.log('Validation errors:');
  error.issues.forEach(issue => {
    console.log(`- ${issue.path.map(p => p.key).join('.')}: ${issue.message}`);
  });
}
[/highlight]