# Source: https://betterstack.com/community/guides/scaling-nodejs/express-validator-nodejs/
# Original language: javascript
# Normalized: js
# Block index: 3

[label index.js]
import express from "express";
const app = express();
const PORT = 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to the Validation Demo!");
});

// User registration endpoint without validation
app.post("/register", (req, res) => {
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