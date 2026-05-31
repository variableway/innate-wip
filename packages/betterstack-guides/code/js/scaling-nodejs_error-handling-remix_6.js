# Source: https://betterstack.com/community/guides/scaling-nodejs/error-handling-remix/
# Original language: javascript
# Normalized: js
# Block index: 6

export class ValidationError extends AppError {
  constructor(message, fields) {
    super(message, 400);
    this.fields = fields;
  }
}

export class AuthenticationError extends AppError {
  constructor(message) {
    super(message, 401);
  }
}