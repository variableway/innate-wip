# Source: https://betterstack.com/community/guides/scaling-nodejs/express-validator-nodejs/
# Original language: javascript
# Normalized: js
# Block index: 11

[label index.js]
import express from "express";
[highlight]
import { body, validationResult } from "express-validator";
[/highlight]
const app = express();
const PORT = 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to the Validation Demo!");
});

// User registration endpoint with validation
[highlight]
app.post("/register", [
  // Validate name
  body("name").notEmpty().withMessage("Name is required"),
  
  // Validate email
  body("email").isEmail().withMessage("Invalid email address"),
  
  // Validate password
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
], (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
[/highlight]
  
  const { name, email, password } = req.body;
  
  // Store user data (in a real app, this would go to a database)
  const user = { name, email, password };
  
  res.status(201).json({ 
    message: "User registered successfully", 
    user: { name, email } 
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});