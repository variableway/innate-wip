# Source: https://betterstack.com/community/guides/scaling-nodejs/migrating-from-express-to-fastify/
# Original language: javascript
# Normalized: js
# Block index: 6

// Express with external validation
import { body, param, validationResult } from 'express-validator';

app.post('/users/:id', [
  param('id').isUUID(),
  body('name').isString().isLength({ min: 2, max: 50 }),
  body('email').isEmail()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  // Process valid data
  const { name, email } = req.body;
  // ... rest of handler
});