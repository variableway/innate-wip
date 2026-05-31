# Source: https://betterstack.com/community/guides/scaling-nodejs/joi-explained/
# Original language: javascript
# Normalized: js
# Block index: 13

[label index.js]
import userSchema from './validation.js';

// Admin without permissions (should fail)
const adminWithoutPermissions = {
  username: 'admin_user',
  email: 'admin@example.com',
  age: 30,
  role: 'admin'
};

// Regular user with permissions (should fail)
const regularUserWithPermissions = {
  username: 'regular_user',
  email: 'user@example.com',
  age: 25,
  role: 'user',
  permissions: ['read']
};

// Valid admin with permissions
const validAdmin = {
  username: 'valid_admin',
  email: 'valid.admin@example.com',
  age: 35,
  role: 'admin',
  permissions: ['read', 'write', 'delete']
};

console.log('Admin without permissions:');
console.log(userSchema.validate(adminWithoutPermissions, { abortEarly: false }).error?.message || 'Valid');

console.log('\nRegular user with permissions:');
console.log(userSchema.validate(regularUserWithPermissions, { abortEarly: false }).error?.message || 'Valid');

console.log('\nValid admin:');
console.log(userSchema.validate(validAdmin, { abortEarly: false }).error?.message || 'Valid');