# Source: https://betterstack.com/community/guides/scaling-nodejs/express-validator-nodejs/
# Original language: javascript
# Normalized: js
# Block index: 15

...
[label index.js]
// User registration endpoint with improved validation
app.post("/register", [
  // Validate name
  body("name")
    .notEmpty().withMessage("Name is required")
[highlight]
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage("Name must be between 2 and 50 characters"),
[/highlight]
  
  // Validate email
  body("email")
    .notEmpty().withMessage("Email is required")
[highlight]
    .isEmail().withMessage("Invalid email format")
    .normalizeEmail(),
[/highlight]
  
  // Validate password
  body("password")
    .notEmpty().withMessage("Password is required")
[highlight]
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
[/highlight]
], (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  // Process valid data...
  const { name, email, password } = req.body;
  res.status(201).json({ 
    message: "User registered successfully", 
    user: { name, email } 
  });
});