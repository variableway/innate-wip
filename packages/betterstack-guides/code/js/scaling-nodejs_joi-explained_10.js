# Source: https://betterstack.com/community/guides/scaling-nodejs/joi-explained/
# Original language: javascript
# Normalized: js
# Block index: 10

[label index.js]
...
[highlight]
const result = userSchema.validate(invalidUserData, { abortEarly: false });
[/highlight]

if (result.error) {
[highlight]
  console.error('Validation errors:');
  result.error.details.forEach(detail => {
    console.error(`- ${detail.message}`);
  });
[/highlight]
} else {
  console.log('Valid user data:', result.value);
}