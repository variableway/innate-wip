# Source: https://betterstack.com/community/guides/scaling-nodejs/express-validator-nodejs/
# Original language: javascript
# Normalized: js
# Block index: 18

[label index.js]
// Validate email with custom domain validation
body("email")
  .notEmpty().withMessage("Email is required")
  .isEmail().withMessage("Invalid email format")
[highlight]
  .custom(value => {
    const allowedDomains = ['example.com', 'company.org', 'business.net'];
    const domain = value.split('@')[1];
    
    if (!allowedDomains.includes(domain)) {
      throw new Error(`Email must be from one of these domains: ${allowedDomains.join(', ')}`);
    }
    
    return true;
  })
[/highlight]
  .normalizeEmail(),