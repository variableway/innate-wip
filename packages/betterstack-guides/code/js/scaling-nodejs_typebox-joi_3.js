# Source: https://betterstack.com/community/guides/scaling-nodejs/typebox-joi/
# Original language: javascript
# Normalized: js
# Block index: 3

const { error, value } = userSchema.validate(input);

if (error) {
  console.log('Invalid data:', error.message);
} else {
  saveUser(value); // Data is valid and normalized
}