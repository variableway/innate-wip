# Source: https://betterstack.com/community/guides/scaling-nodejs/express-web-api/
# Original language: javascript
# Normalized: js
# Block index: 11

[label validators/post.js]
import { body, query, param, validationResult } from 'express-validator';

// Middleware to validate results
const validateResults = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ 
      errors: errors.array(),
      status: 'Unprocessable Entity' 
    });
  }
  next();
};