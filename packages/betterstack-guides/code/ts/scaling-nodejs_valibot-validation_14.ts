# Source: https://betterstack.com/community/guides/scaling-nodejs/valibot-validation/
# Original language: typescript
# Normalized: ts
# Block index: 14

[label index.ts]
[highlight]
import { validatePerson, Person } from './validator.js';
[/highlight]

// Valid person data
const validPerson = {
  name: 'Jane Doe',
  email: 'jane@example.com',
  age: 25
};

// Invalid person data
const invalidPerson = {
  name: 'Jo',
  email: 'not-an-email',
  age: 16
};

[highlight]
// Validate both examples
const validResult = validatePerson(validPerson);
const invalidResult = validatePerson(invalidPerson);

// Check the valid result with type safety
if (validResult.success) {
  // TypeScript knows this is a Person type
  const person: Person = validResult.data;
  console.log('Valid person data:', person);
  
  // This would cause a TypeScript error:
  // person.nonExistentProperty = 123;
} else {
  // This code will never run for validPerson,
  // but TypeScript knows the type structure
  console.log('Validation errors:', validResult.errors);
}
[/highlight]

// Check the invalid result
if (!invalidResult.success) {
  console.log('Invalid person result:');
  invalidResult.errors.forEach(error => {
    console.log(`- ${error.field}: ${error.message}`);
  });
}