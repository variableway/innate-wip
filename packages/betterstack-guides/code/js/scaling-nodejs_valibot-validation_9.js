# Source: https://betterstack.com/community/guides/scaling-nodejs/valibot-validation/
# Original language: javascript
# Normalized: js
# Block index: 9

[label validator.js]
import * as v from 'valibot';

// Define our person schema
const personSchema = v.object({
  name: v.pipe(
    v.string('Name must be a string'),
    v.minLength(3, 'Name must be at least 3 characters'),
    v.maxLength(20, 'Name cannot exceed 20 characters')
  ),
  email: v.pipe(
    v.string('Email must be a string'),
    v.email('Must be a valid email address')
  ),
  age: v.pipe(
    v.number('Age must be a number'),
    v.minValue(18, 'Must be at least 18 years old')
  )
});

// Create a function to validate a person
function validatePerson(data) {
  try {
    // Validate against our schema
    const validatedData = v.parse(personSchema, data);
    return { data: validatedData, success: true };
  } catch (error) {
    // Return validation errors
    return { 
      success: false, 
      errors: error.issues.map(issue => ({
        field: issue.path.map(p => p.key).join('.'),
        message: issue.message
      }))
    };
  }
}

export { validatePerson };