# Source: https://betterstack.com/community/guides/scaling-nodejs/express-validator-nodejs/
# Original language: javascript
# Normalized: js
# Block index: 14

body("email")
  .isEmail()               // Validator: check if it's a valid email
  .normalizeEmail()        // Sanitizer: normalize the email
  .trim()                  // Sanitizer: remove leading/trailing spaces
  .withMessage("Please provide a valid email address");  // Custom error message