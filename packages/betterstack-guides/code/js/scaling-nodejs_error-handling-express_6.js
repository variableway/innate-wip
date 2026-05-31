# Source: https://betterstack.com/community/guides/scaling-nodejs/error-handling-express/
# Original language: javascript
# Normalized: js
# Block index: 6

[label utils/AppError.js]
class AppError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}