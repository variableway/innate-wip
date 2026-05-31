# Source: https://betterstack.com/community/guides/scaling-nodejs/typebox-explained/
# Original language: typescript
# Normalized: ts
# Block index: 13

[label optional-nullable.ts]
[label optional-nullable.ts]
import { Type } from '@sinclair/typebox';
import { TypeCompiler } from '@sinclair/typebox/compiler';

// Define a schema with optional and nullable properties
const ProfileSchema = Type.Object({
  username: Type.String(),
  displayName: Type.Optional(Type.String()),
  bio: Type.Union([Type.String(), Type.Null()]), // nullable string
  website: Type.Union([Type.String(), Type.Null()]), // another nullable string
  age: Type.Optional(Type.Number())
});

// Extract the TypeScript type - just like you learned earlier
type Profile = typeof ProfileSchema.static;

// Create a valid profile using optional/nullable fields
const profile: Profile = {
  username: 'johndoe',
  // displayName is optional, so we can omit it
  bio: null, // bio can be null
  website: 'https://example.com'
  // age is optional, so we can omit it
};

// Compile and validate - the same pattern we've been using
const validator = TypeCompiler.Compile(ProfileSchema);
console.log('Valid profile:', validator.Check(profile));

// Invalid profile - missing required field
const invalidProfile = {
  // username is missing
  displayName: 'John',
  bio: null,
  website: 'https://example.com'
};

console.log('Invalid profile:', validator.Check(invalidProfile));
console.log('Validation errors:', [...validator.Errors(invalidProfile)]);