# Source: https://betterstack.com/community/guides/scaling-nodejs/vinejs-nodejs/
# Original language: javascript
# Normalized: js
# Block index: 14

[label index.js]
import express from "express";
import vine from "@vinejs/vine";
[highlight]
import { SimpleMessagesProvider } from "@vinejs/vine";
[/highlight]

const app = express();
const PORT = 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Define validation schema at the top level of your file
const schema = vine.object({
  name: vine
    .string()
    .trim()
    .minLength(2)
    .maxLength(50),
  
  email: vine
    .string()
    .trim()
    .email()
[highlight]
    .normalizeEmail(),
[/highlight]
  
  password: vine
    .string()
    .minLength(8)
[highlight]
    .maxLength(100)
    .regex(/[A-Z]/)
    .regex(/[0-9]/),
    
  password_confirmation: vine
    .string()
[/highlight]
});

[highlight]
// Define custom messages
vine.messagesProvider = new SimpleMessagesProvider({
  minLength: 'The {{ field }} field must have at least {{ min }} characters',
  maxLength: 'The {{ field }} field must not be greater than {{ max }} characters',
  email: 'Please provide a valid email address',
  regex: 'The {{ field }} field format is invalid'
});
[/highlight]

app.get("/", (req, res) => {
  res.send("Welcome to the VineJS Validation Demo!");
});

// User registration endpoint with validation
app.post("/register", async (req, res) => {
  try {
    [highlight]
    // Pre-compile the schema for performance optimization
    const validator = vine.compile(schema);
    const validatedData = await validator.validate(req.body);
    [/highlight]
    
    // Work with validated data, which now matches the schema exactly
    res.status(201).json({ 
      message: "Registration successful", 
      user: { 
        name: validatedData.name, 
        email: validatedData.email 
      } 
    });
  } catch (error) {
    return res.status(400).json({ errors: error.messages });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});