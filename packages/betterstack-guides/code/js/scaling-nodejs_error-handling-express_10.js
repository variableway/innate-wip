# Source: https://betterstack.com/community/guides/scaling-nodejs/error-handling-express/
# Original language: javascript
# Normalized: js
# Block index: 10

[label utils/ValidationError.js]
class ValidationError extends AppError {
  constructor(message, details) {
    super(message, 400);
    this.details = details; // Additional validation details
  }
}