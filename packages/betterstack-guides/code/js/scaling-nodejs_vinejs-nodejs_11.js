# Source: https://betterstack.com/community/guides/scaling-nodejs/vinejs-nodejs/
# Original language: javascript
# Normalized: js
# Block index: 11

[label index.js]
import express from "express";
[highlight]
import vine from "@vinejs/vine";
[/highlight]

const app = express();
const PORT = 3000;

[highlight]
// Define validation schema using VineJS's object schema builder
const schema = vine.object({
  name: vine.string().trim().minLength(2).maxLength(50),
  email: vine.string().email(),
  password: vine.string().minLength(8)
});
[/highlight]

// Middleware to parse JSON request bodies
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to the VineJS Validation Demo!");
});

// User registration endpoint with validation
[highlight]
app.post("/register", async (req, res) => {
  try {
    // VineJS returns a Promise, so we use await here
    const validatedData = await vine.validate({ schema, data: req.body });

    // Process validated data
    res.status(201).json({
      message: "User registered successfully",
      user: {
        name: validatedData.name,
        email: validatedData.email
      }
    });
  } catch (error) {
    // Handle validation errors
    return res.status(400).json({ errors: error.messages });
  }
[highlight]

});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});