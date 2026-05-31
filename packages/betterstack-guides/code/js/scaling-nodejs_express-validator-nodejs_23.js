# Source: https://betterstack.com/community/guides/scaling-nodejs/express-validator-nodejs/
# Original language: javascript
# Normalized: js
# Block index: 23

[label index.js]
import express from "express";
import { body, validationResult } from "express-validator";
[highlight]
import { validate } from "./middlewares/validationMiddleware.js";
[/highlight]

const app = express();
const PORT = 3000;

app.use(express.json());

app.post("/register", [
  body("name")
    .notEmpty().withMessage("Name is required")
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage("Name must be between 2 and 50 characters"),
  
  body("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email format")
    .normalizeEmail(),
  
  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters long")
    .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
    .matches(/[0-9]/).withMessage("Password must contain at least one number")
[highlight]
], validate, (req, res) => {
  // If we get here, validation passed
[/highlight]
  const { name, email } = req.body;
  
  res.status(201).json({
    success: true,
    message: "Registration successful",
    user: { name, email }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});