# Source: https://betterstack.com/community/guides/scaling-nodejs/valibot-validation/
# Original language: typescript
# Normalized: ts
# Block index: 13

[label validator.ts]
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

[highlight]
// Generate TypeScript type from the schema
type Person = v.InferOutput<typeof personSchema>;

// Define return types for our validation function
type ValidationSuccess<T> = { data: T; success: true };
type ValidationError = { 
  success: false; 
  errors: Array<{ field: string; message: string }> 
};
type ValidationResult<T> = ValidationSuccess<T> | ValidationError;

// Create a function to validate a person
function validatePerson(data: unknown): ValidationResult<Person> {
[/highlight]
  try {
    // Validate against our schema
    const validatedData = v.parse(personSchema, data);
    return { data: validatedData, success: true };
[highlight]
  } catch (error: any) {
    // Return validation errors
    return { 
      success: false, 
      errors: error.issues.map((issue: any) => ({
        field: issue.path.map((p: any) => p.key).join('.'),
        message: issue.message
      }))
    };
  }
[/highlight]
}

export { validatePerson, Person };